"use server";

import { z, ZodError } from "zod";
import { formSchema } from "./validation";
import { ErrorProps, State } from "@/lib/types";
import { STR_SOMETHING_WENT_WRONG } from "@/lib/const";
import prisma from "../../../../../prisma/prisma";

export async function actionHandleSubmit(
  prevState: State,
  data: FormData
): Promise<State> {
  try {
    console.log("🚀 ~ data:", data);
    const input = Object.fromEntries(data);
    const response = formSchema.safeParse(input);
    if (!response.success) {
      throw new Error(response.error.errors[0].message);
    }
    const { otp, email } = response.data;
    console.log("🚀 ~ email:", email, Buffer.from(email, "base64").toString());
    console.log("🚀 ~ otp:", otp);
    const isUserExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!isUserExist) {
      await prisma.user.create({
        data: {
          email,
          username: email,
        },
      });
    }
    return {
      status: "success",
      message: "",
    };
  } catch (error) {
    const { message = STR_SOMETHING_WENT_WRONG }: ErrorProps = error || {};
    if (error instanceof ZodError) {
      return {
        status: "error",
        message: "Invalid form data.",
        errors: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: `Server validation: ${issue.message}`,
        })),
      };
    }
    return {
      status: "error",
      message,
    };
  }
}
