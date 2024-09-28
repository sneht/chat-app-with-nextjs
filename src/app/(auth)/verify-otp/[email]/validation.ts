import {
  STR_EMAIL_IS_NOT_VALID,
  STR_EMAIL_IS_REQUIRED,
  STR_EMAIL_MUST_BE_AT_LEAST_3_CHARACTERS,
  STR_EMAIL_MUST_BE_LESS_THAN_OR_EQUAL_TO_132_CHARACTERS,
} from "@/lib/const";
import { z } from "zod";

export const formSchema = z.object({
  email: z
    .string()
    .nonempty({ message: STR_EMAIL_IS_REQUIRED })
    .min(3, {
      message: STR_EMAIL_MUST_BE_AT_LEAST_3_CHARACTERS,
    })
    .max(132, {
      message: STR_EMAIL_MUST_BE_LESS_THAN_OR_EQUAL_TO_132_CHARACTERS,
    })
    .trim(),
  otp: z
    .string()
    .min(6, {
      message: "OTP must be 6 digits.",
    })
    .max(6, {
      message: "OTP must be 6 digits.",
    }),
});
