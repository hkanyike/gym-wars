// src/lib/validation.ts
import { z } from "zod";

/* ---------------------------------------------
   Common helpers
---------------------------------------------- */

export const PhoneRegex = /^[0-9+\-\s().]+$/;

export const RoleEnum = z.enum(["Trainer", "Member"]);

// Use plain string for state to avoid enum maintenance;
// must be 2 letters (e.g., "NJ"), but we accept any 2-letter code.
export const StateCode = z
  .string()
  .trim()
  .toUpperCase()
  .length(2, "Use 2-letter state code");

// Booth sizes: use x (ASCII) for value; render with × in UI if you like
export const BoothSizeEnum = z.enum(["10x10", "10x20", "20x20"]);

/* ---------------------------------------------
   Trainers & Members — “About You” form
---------------------------------------------- */

export const AboutYouSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || PhoneRegex.test(v), { message: "Enter a valid phone" }),
  role: RoleEnum, // <-- no required_error here
  emergencyContact: z.string().trim().optional().or(z.literal("")),
  emergencyContactPhone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || PhoneRegex.test(v), { message: "Enter a valid phone" }),
  // Either a selected gymId or a free-text gymName (both optional for now)
  gymId: z.string().trim().optional().or(z.literal("")),
  gymName: z.string().trim().optional().or(z.literal("")),
  // Allow client to request auto-joining current event
  joinCurrentEvent: z.boolean().optional(),
});
export type AboutYouInput = z.infer<typeof AboutYouSchema>;

/* ---------------------------------------------
   Register Gym form
---------------------------------------------- */

export const RegisterGymSchema = z.object({
  // Gym info
  gymName: z.string().trim().min(1, "Gym name is required"),
  address1: z.string().trim().min(1, "Street address is required"),
  address2: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required"),
  state: StateCode,
  zip: z
    .string()
    .trim()
    .min(3, "Enter a valid ZIP/postcode"),
  website: z.string().trim().url().optional().or(z.literal("")),

  // Rep info (we removed the “rep” label in UI; still fields here)
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a valid phone").regex(PhoneRegex, "Enter a valid phone"),

  // Event the gym is registering for (ISO date string)
  eventDateISO: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),

  // Agreements
  participationAgreementAccepted: z.boolean().refine((v) => v === true, {
    message: "You must confirm and sign the participation agreement",
  }),
  termsAccepted: z.boolean().refine((v) => v === true, {
    message: "You must accept the terms",
  }),
});
export type RegisterGymInput = z.infer<typeof RegisterGymSchema>;

/* ---------------------------------------------
   Vendor Registration form
---------------------------------------------- */

export const VendorRegistrationSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  contactFirstName: z.string().trim().min(1, "First name is required"),
  contactLastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a valid phone").regex(PhoneRegex, "Enter a valid phone"),
  boothSize: BoothSizeEnum, // <-- no required_error param
  notes: z.string().trim().optional().or(z.literal("")),
  termsAccepted: z.boolean().refine((v) => v === true, {
    message: "You must agree to vendor terms",
  }),
});
export type VendorRegistrationInput = z.infer<typeof VendorRegistrationSchema>;

/* ---------------------------------------------
   Optional: Gym Request (if you use a “request a gym” API)
---------------------------------------------- */

export const GymRequestSchema = z.object({
  gymName: z.string().trim().min(1, "Gym name is required"),
  city: z.string().trim().min(1, "City is required"),
  state: StateCode,
  contactEmail: z.string().trim().toLowerCase().email("Enter a valid email"),
  contactName: z.string().trim().min(1, "Contact name is required"),
  notes: z.string().trim().optional().or(z.literal("")),
});
export type GymRequestInput = z.infer<typeof GymRequestSchema>;

/* ---------------------------------------------
   Participants API (CREATE / UPDATE)
   (These mirror AboutYou with slightly different optionality)
---------------------------------------------- */

// Create (server-side) — same as AboutYou but everything explicit
export const ParticipantCreateSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  phone: z.string().trim().optional().or(z.literal("")),
  role: RoleEnum,
  emergencyContact: z.string().trim().optional().or(z.literal("")),
  emergencyContactPhone: z.string().trim().optional().or(z.literal("")),
  gymId: z.string().trim().optional().or(z.literal("")),
  gymName: z.string().trim().optional().or(z.literal("")),
  joinCurrentEvent: z.boolean().optional(),
});
export type ParticipantCreateInput = z.infer<typeof ParticipantCreateSchema>;

// Update (server-side) — email required to locate the record; others optional
export const ParticipantUpdateSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  role: RoleEnum.optional(),
  emergencyContact: z.string().trim().optional(),
  emergencyContactPhone: z.string().trim().optional(),
  gymId: z.string().trim().optional().or(z.literal("")),
  gymName: z.string().trim().optional().or(z.literal("")),
  joinCurrentEvent: z.boolean().optional(),
});
export type ParticipantUpdateInput = z.infer<typeof ParticipantUpdateSchema>;

/* ---------------------------------------------
   Leaderboard admin update schema (flexible)
---------------------------------------------- */

export const LeaderboardUpsertSchema = z.object({
  id: z.string().trim().min(1, "ID is required"),
  name: z.string().trim().min(1, "Gym name is required"),
  city: z.string().trim().optional().or(z.literal("")),
  state: StateCode.optional(),
  trainers: z.number().int().nonnegative().optional(),
  members: z.number().int().nonnegative().optional(),

  // Per-event points (optional numbers)
  buyInPoints: z.number().int().nonnegative().optional(),
  burpeeDeadliftPoints: z.number().int().nonnegative().optional(),
  lungeRelayPoints: z.number().int().nonnegative().optional(),
  pullSprintPoints: z.number().int().nonnegative().optional(),
  pushTirePoints: z.number().int().nonnegative().optional(),

  // Optional time strings like "4:12"
  burpeeDeadliftTime: z.string().trim().optional().or(z.literal("")),
  lungeRelayTime: z.string().trim().optional().or(z.literal("")),
  pullSprintTime: z.string().trim().optional().or(z.literal("")),
  pushTireTime: z.string().trim().optional().or(z.literal("")),

  // Calculated or explicit
  totalScore: z.number().int().nonnegative().optional(),
});
export type LeaderboardUpsertInput = z.infer<typeof LeaderboardUpsertSchema>;
