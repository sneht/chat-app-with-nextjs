"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card/card";
import React, { useEffect, useState } from "react";
import SignInForm from "./sign-in-form";
import { Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema, profileFormSchema } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateProfileForm from "./create-profile-form";

type Step = "email" | "verification" | "profile";

function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      email_address: "",
    },
  });

  const {
    setError,
    reset,
    control,
    formState: { isValid },
    getValues,
  } = form;

  const handleShowVerificationSection = () => {
    setStep("verification");
  };
  const hanldeShowCreateProfileSection = () => {
    setStep("profile");
  };

  const handleSetEmailForCreateProfile = (email_address: string) => {
    setEmail(email_address);
  };

  console.log("🚀 ~ LoginPage ~ email:", email);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    mode: "all",
    defaultValues: {
      email_address: email || "",
      username: "",
      profileImage: "",
    },
  });

  useEffect(() => {
    profileForm.setValue("email_address", email);
  }, [email, profileForm]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === "email"
            ? "Enter your email"
            : step === "verification"
            ? "Check your email"
            : "Create your profile"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === "email" && (
            <SignInForm
              form={form}
              handleShowVerificationSection={handleShowVerificationSection}
              hanldeShowCreateProfileSection={hanldeShowCreateProfileSection}
              handleSetEmailForCreateProfile={handleSetEmailForCreateProfile}
            />
          )}

          {step === "verification" && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                We&apos;ve sent a verification email to{" "}
                <strong>{form.getValues("email_address")}</strong>. Please check
                your inbox and follow the instructions to verify your account.
              </p>
            </div>
          )}

          {step === "profile" && <CreateProfileForm form={profileForm} />}
        </div>
      </div>
    </div>
    // <div className="md:container md:mx-auto w-screen h-screen flex flex-col justify-between items-center">
    //   <Card className="w-[450px] p-3 rounded-md border-2 border-gray-300 bg-background">
    //     <CardHeader>
    //       <CardTitle className="mt-1 font-bold text-2xl">
    //         Welcome to Chat app
    //       </CardTitle>
    //       <CardDescription className="mt-1 text-gray-600">
    //         Please enter your details to login
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent className="pt-0">
    //       <SignInForm />
    //     </CardContent>
    //   </Card>
    // </div>
  );
}

export default LoginPage;
