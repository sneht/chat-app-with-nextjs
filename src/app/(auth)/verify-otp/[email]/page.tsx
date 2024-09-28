"use client";

import SignInButton from "@/app/components/login/sign-in-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form/form";
import { Input } from "@/app/components/ui/input/input";
import { STR_EMAIL_ADDRESS } from "@/lib/const";
import { State } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./validation";
import { actionHandleSubmit } from "./_action";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/app/components/ui/input-otp/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card/card";
import { useRouter } from "next/navigation";

function VerifyOTP({
  params,
}: {
  params: {
    email: string;
  };
}) {
  const { email } = params || {};
  const router = useRouter();
  //   const [isShowOTPSection, setIsShowOTPSection] = useState(false);

  const [state, formAction] = useFormState<State, FormData>(
    actionHandleSubmit,
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      email,
      otp: "",
    },
  });

  const {
    setError,
    reset,
    control,
    formState: { isValid },
  } = form;

  useEffect(() => {
    form.setValue("email", email);
  }, [form, email]);

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state && state?.status === "success") {
      router.push("/");
      //   setIsShowOTPSection(true);
      // router.refresh();
    }
    if (state.status === "error" && state.message) {
      console.log(state);
    }
  }, [state]);

  return (
    <div className="md:container md:mx-auto w-screen h-screen flex flex-col justify-between items-center">
      <Card className="w-[450px] p-3 rounded-md border-2 border-gray-300 bg-background">
        <CardHeader>
          <CardTitle className="mt-1 font-bold text-2xl">
            Welcome to Chat app
          </CardTitle>
          <CardDescription className="mt-1 text-gray-600">
            Please verify your otp to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Form {...form}>
            <form action={formAction}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col">
                  <input type="hidden" {...form.register("email")} />
                  <FormField
                    control={control}
                    name="otp"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Enter OTP</FormLabel>
                          <FormControl>
                            <InputOTP
                              maxLength={6}
                              // onChange={(value) => {
                              //   console.log("🚀 ~ VerifyOTP ~ value:", value);
                              //   field.onChange(value);
                              // }}
                              // onBlur={field.onBlur}
                              {...field}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>
              <SignInButton isValid={isValid} />
              {/* <div className="flex mt-5">
          <div className="border-t-2 border-muted-500 w-[45%] mt-3" />
          <span className="pl-2.5 pr-2.5 text-gray-400 text-sm">OR</span>
          <div className="border-t-2 border-muted-500 w-[45%] mt-3" />
        </div>

        <SignInButtonLoginWithGoogle /> */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyOTP;
