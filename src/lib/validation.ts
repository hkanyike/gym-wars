import { z } from "zod";

/** -------------------------
 *  Trainers & Members: About You
 *  (all fields required)
 *  ------------------------- */
export const AboutYouSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(7, "Enter a valid phone")
    .regex(/^[0-9+\-\s().]+$/, "Enter a valid phone"),
  role: z.enum(["Trainer", "Member"], {
    required_error: "Select your role",
  }),
  emergencyContactName: z.string().min(1, "Emergency contact is required"),
  emergencyContactPhone: z
    .string()
    .min(7, "Enter a valid phone")
    .regex(/^[0-9+\-\s().]+$/, "Enter a valid phone"),
});
export type AboutYouInput = z.infer<typeof AboutYouSchema>;

/** -------------------------
 *  Register Gym (3-step wizard)
 *  ------------------------- */
export const RegisterGymSchema = z.object({
  // Step 1 — Gym Info
  gymName: z.string().min(1, "Gym name is required"),
  website: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(3, "ZIP is required"),

  // Step 2 — Representative
  repFirst: z.string().min(1, "First name is required"),
  repLast: z.string().min(1, "Last name is required"),
  repEmail: z.string().email("Enter a valid email"),
  repPhone: z.string().min(7, "Enter a valid phone"),

  // Step 3 — Agreement
  agreeTerms: z
    .boolean()
    .refine((v) => v === true, { message: "You must agree to participate" }),
  eSign: z.string().min(2, "Type your full name as e-signature"),
  date: z.string().min(4, "Date is required"),
});
export type RegisterGymInput = z.infer<typeof RegisterGymSchema>;


export const LeaderboardUpdateSchema = z
  .object({
    id: z.string().min(1, "Gym id is required"),
    name: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    totalScore: z.coerce.number().int().nonnegative().optional(),
    wins: z.coerce.number().int().nonnegative().optional(),
    trainers: z.coerce.number().int().nonnegative().optional(),
    members: z.coerce.number().int().nonnegative().optional(),
  })
  .refine((val) => {
    // must provide at least one field besides id
    const keys = Object.keys(val).filter((k) => k !== "id");
    return keys.length > 0;
  }, "Provide at least one field to update besides id");

export type LeaderboardUpdateInput = z.infer<typeof LeaderboardUpdateSchema>;
