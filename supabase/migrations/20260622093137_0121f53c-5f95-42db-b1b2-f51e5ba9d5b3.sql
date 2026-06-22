
-- Enums
CREATE TYPE public.app_role AS ENUM ('student','admin');
CREATE TYPE public.department AS ENUM ('Computer Engineering','Electrical Engineering','Mechanical Engineering','Civil Engineering','MENA Engineering');
CREATE TYPE public.gender AS ENUM ('Male','Female');
CREATE TYPE public.payment_status AS ENUM ('not_uploaded','pending','approved','rejected');
CREATE TYPE public.payment_type AS ENUM ('advance','final');
CREATE TYPE public.payment_slip_status AS ENUM ('pending','approved','rejected');
CREATE TYPE public.lunch_preference AS ENUM ('Chicken','Fish','Vegetarian');
CREATE TYPE public.dinner_preference AS ENUM ('Rice','Kottu','Fried Rice','Vegetarian');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  registration_number TEXT UNIQUE,
  department public.department,
  gender public.gender,
  phone TEXT,
  lunch_preference public.lunch_preference,
  dinner_preference public.dinner_preference,
  advance_payment_status public.payment_status NOT NULL DEFAULT 'not_uploaded',
  final_payment_status public.payment_status NOT NULL DEFAULT 'not_uploaded',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Profile policies
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(),'admin'));

-- User roles policies
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- Payment slips
CREATE TABLE public.payment_slips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_type public.payment_type NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  slip_url TEXT NOT NULL,
  status public.payment_slip_status NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_slips TO authenticated;
GRANT ALL ON public.payment_slips TO service_role;
ALTER TABLE public.payment_slips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own slips" ON public.payment_slips FOR SELECT TO authenticated
  USING (auth.uid() = student_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Students upload own slips" ON public.payment_slips FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admins update slips" ON public.payment_slips FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Buses
CREATE TABLE public.buses (
  id INT PRIMARY KEY,
  name TEXT NOT NULL,
  capacity INT NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.buses TO authenticated, anon;
GRANT ALL ON public.buses TO service_role;
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view buses" ON public.buses FOR SELECT TO authenticated, anon USING (true);

INSERT INTO public.buses (id, name) VALUES
  (1,'Bus 1'),(2,'Bus 2'),(3,'Bus 3'),(4,'Bus 4'),
  (5,'Bus 5'),(6,'Bus 6'),(7,'Bus 7'),(8,'Bus 8');

-- Seat bookings
CREATE TABLE public.seat_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  bus_id INT NOT NULL REFERENCES public.buses(id),
  seat_number INT NOT NULL CHECK (seat_number BETWEEN 1 AND 50),
  booked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (bus_id, seat_number)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seat_bookings TO authenticated;
GRANT ALL ON public.seat_bookings TO service_role;
ALTER TABLE public.seat_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated view all bookings" ON public.seat_bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students book own seat with approved payment" ON public.seat_bookings FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = student_id AND (
      public.has_role(auth.uid(),'admin')
      OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.advance_payment_status = 'approved')
    )
  );
CREATE POLICY "Students delete own booking" ON public.seat_bookings FOR DELETE TO authenticated
  USING (auth.uid() = student_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update bookings" ON public.seat_bookings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name',''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Storage policies for payment-slips bucket (bucket created via tool)
CREATE POLICY "Students upload own slip files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payment-slips' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Students view own slip files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'payment-slips' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "Admins delete slip files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'payment-slips' AND public.has_role(auth.uid(),'admin'));
