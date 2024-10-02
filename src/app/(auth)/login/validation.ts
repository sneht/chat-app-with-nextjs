import {
  STR_EMAIL_IS_NOT_VALID,
  STR_EMAIL_IS_REQUIRED,
  STR_EMAIL_MUST_BE_AT_LEAST_3_CHARACTERS,
  STR_EMAIL_MUST_BE_LESS_THAN_OR_EQUAL_TO_132_CHARACTERS,
} from "@/lib/const";
import { z } from "zod";

export const formSchema = z.object({
  email_address: z
    .string()
    .nonempty({ message: STR_EMAIL_IS_REQUIRED })
    .min(3, {
      message: STR_EMAIL_MUST_BE_AT_LEAST_3_CHARACTERS,
    })
    .max(132, {
      message: STR_EMAIL_MUST_BE_LESS_THAN_OR_EQUAL_TO_132_CHARACTERS,
    })
    .regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, {
      message: STR_EMAIL_IS_NOT_VALID,
    })
    .trim(),
});

export const profileFormSchema = z.object({
  email_address: z
    .string()
    .nonempty({ message: STR_EMAIL_IS_REQUIRED })
    .min(3, {
      message: STR_EMAIL_MUST_BE_AT_LEAST_3_CHARACTERS,
    })
    .max(132, {
      message: STR_EMAIL_MUST_BE_LESS_THAN_OR_EQUAL_TO_132_CHARACTERS,
    })
    .regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, {
      message: STR_EMAIL_IS_NOT_VALID,
    })
    .trim(),
  username: z.string().min(1, { message: "User name is required" }),
  profileImage: z.string().optional(),
});

export const ChatformSchema = z.object({
  group_id: z.string(),
  message: z.string(),
});
