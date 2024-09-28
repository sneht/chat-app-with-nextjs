"use server";

import { STR_SOMETHING_WENT_WRONG } from "@/lib/const";
import { ErrorProps, State } from "@/lib/types";
import prisma from "../../../../prisma/prisma";
import { ZodError } from "zod";
import { formSchema, profileFormSchema } from "./validation";
import { sendMail } from "@/lib/email-service";
import { SendOtpInMailTemplate } from "@/lib/mjml-templates/send-otp-in-mail";
import { v4 as uuidv4 } from "uuid";
import { signIn } from "@/auth";

export async function actionHandleSubmit(
  prevState: State,
  data: FormData
): Promise<State> {
  try {
    const input = Object.fromEntries(data);
    const response = formSchema.safeParse(input);
    if (!response.success) {
      throw new Error(response.error.errors[0].message);
    }
    const { email_address } = response.data;

    const user = await prisma.user.findFirst({
      where: {
        email: email_address,
      },
    });

    //Create new user
    if (!user) {
      const newuser = await prisma.user.create({
        data: {
          email: email_address,
          // ... other user data ...
          // verificationToken,
        },
      });
      // sendMail({
      //   to: email_address,
      //   type: "",
      //   htmlContent: SendOtpInMailTemplate({
      //     user_name: "John Doe",
      //     link: verificationLink,
      //   }),
      // });
      return {
        status: "success",
        message: "Registration successfully",
        data: newuser,
      };
    }
    const hasProfileCreated = await prisma.user.findFirst({
      where: {
        email: email_address,
        emailVerified: { not: null },
      },
    });
    if (!hasProfileCreated) {
      return {
        status: "success",
        data: user,
        message: "",
      };
    }

    const verificationToken = uuidv4();
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${verificationToken}`;

    await prisma.user.update({
      where: {
        email: email_address,
      },
      data: {
        verificationToken,
      },
    });

    sendMail({
      to: email_address,
      type: "",
      htmlContent: SendOtpInMailTemplate({
        user_name: "John Doe",
        link: verificationLink,
      }),
    });

    return {
      status: "success",
      message: "login successfully",
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

export async function updateUserDetailsAndSendMail(
  prevState: State,
  data: FormData
): Promise<State> {
  try {
    const input = Object.fromEntries(data);
    console.log("🚀 ~ data:", data);
    const response = profileFormSchema.safeParse(input);
    if (!response.success) {
      throw new Error(response.error.errors[0].message);
    }
    const { username, email_address, profileImage } = response.data || {};
    const isUser = await prisma.user.findFirst({
      where: {
        email: email_address,
        emailVerified: null,
      },
    });
    if (!isUser) {
      return {
        status: "error",
        message: "User not found",
      };
    }
    await prisma.user.update({
      where: {
        email: email_address,
        emailVerified: null,
      },
      data: {
        username,
        profileImage,
        emailVerified: new Date(),
      },
    });

    await signIn("credentials", {
      email: email_address,
      redirect: true,
      redirectTo: "/",
    });

    return {
      status: "success",
      message: "",
    };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return {
      status: "error",
      message: (error as string) || "",
    };
  }
}
