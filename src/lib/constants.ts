export const TRIP = {
  destination: "Badulla",
  date: "11th July 2026",
  university: "University of Ruhuna — Faculty of Engineering",
  advanceAmount: 1000,
  finalAmount: 2000,
} as const;

export const BANK = {
  bankName: "People's Bank",
  branch: "Dankotuwa Branch",
  accountNumber: "291200150038304",
  accountHolder: "Sandaru Dissanayake",
} as const;

export const DEPARTMENTS = [
  "Computer Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "MENA Engineering",
] as const;

export const GENDERS = ["Male", "Female"] as const;
export const LUNCH = ["Chicken", "Fish", "Vegetarian"] as const;
export const DINNER = ["Rice", "Kottu", "Fried Rice", "Vegetarian"] as const;

export const BUS_COUNT = 8;
export const BUS_CAPACITY = 50;
