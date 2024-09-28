"use client";

import SignInButton from "@/app/components/login/sign-in-button";
import SignInButtonLoginWithGoogle from "@/app/components/login/sign-in-with-google-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form/form";
import { Input } from "@/app/components/ui/input/input";
import { State } from "@/lib/types";
import { Mail } from "lucide-react";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { UseFormReturn } from "react-hook-form";
import { actionHandleSubmit } from "./_action";

export default function SignInForm({
  form,
  handleShowVerificationSection,
  hanldeShowCreateProfileSection,
  handleSetEmailForCreateProfile,
}: {
  form: UseFormReturn<
    {
      email_address: string;
    },
    any,
    undefined
  >;
  handleShowVerificationSection: () => void;
  hanldeShowCreateProfileSection: () => void;
  handleSetEmailForCreateProfile: (email_address: string) => void;
}) {
  const {
    setError,
    reset,
    control,
    formState: { isValid },
  } = form;

  const [state, formAction] = useFormState<State, FormData>(
    actionHandleSubmit,
    null
  );

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state && state?.status === "success") {
      if (state.data) {
        hanldeShowCreateProfileSection();
        const { email } = state.data || {};
        handleSetEmailForCreateProfile(email);
      } else {
        handleShowVerificationSection();
      }
    }
    if (state.status === "error" && state.message) {
      console.log(state);
    }
  }, [
    state,
    hanldeShowCreateProfileSection,
    handleShowVerificationSection,
    handleSetEmailForCreateProfile,
  ]);

  return (
    <Form {...form}>
      <form action={formAction}>
        <div>
          <FormField
            control={control}
            name="email_address"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </FormLabel>
                  <FormControl>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Input
                        placeholder="Eg. Selena@gmail.com"
                        {...field}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <SignInButton isValid={isValid} />
        {/* <SignInButtonLoginWithGoogle /> */}
        {/* <div className="flex mt-5">
          <div className="border-t-2 border-muted-500 w-[45%] mt-3" />
          <span className="pl-2.5 pr-2.5 text-gray-400 text-sm">OR</span>
          <div className="border-t-2 border-muted-500 w-[45%] mt-3" />
        </div>

        <SignInButtonLoginWithGoogle /> */}
      </form>
    </Form>
  );
}
