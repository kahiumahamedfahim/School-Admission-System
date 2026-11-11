import { z } from "zod";

export const studentIdSchema = z.object({
    studentId: z
        .string()
        .regex(/^\d{17}$/, "Student ID must be exactly 17 digits"),
});