"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form/form";
import { State } from "@/lib/types";
import { Mail, User } from "lucide-react";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { updateUserDetailsAndSendMail } from "./_action";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/app/components/ui/input/input";
import { useRouter } from "next/navigation";
import CreateProfileSubmitButton from "@/app/components/create-profile/create-profile-submit-button";

function CreateProfileForm({
  form,
}: {
  form: UseFormReturn<
    {
      email_address: string;
      username: string;
      profileImage?: string | undefined;
    },
    any,
    undefined
  >;
}) {
  const {
    control,
    formState: { isValid },
  } = form;
  const router = useRouter();

  const [state, formAction] = useFormState<State, FormData>(
    updateUserDetailsAndSendMail,
    null
  );

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state && state?.status === "success") {
      router.push("/");
      //   if (state.data) {
      //     hanldeShowCreateProfileSection();
      //   } else {
      //     handleShowVerificationSection();
      //   }
    }
    if (state.status === "error" && state.message) {
      console.log(state);
    }
  }, [state, router]);

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
        <div className="mt-3">
          <FormField
            control={control}
            name="username"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    User Name
                  </FormLabel>
                  <FormControl>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Input
                        placeholder="John Doe"
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
        {/* <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="username"
              id="username"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Choose a username"
              // value={formData.username}
              // onChange={handleInputChange}
              required
            />
          </div>
        </div> */}
        {/* <div className="mt-3">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Image
          </label>
          <div className="mt-1 flex items-center">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
              {formData.image ? (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
            </span>
            <label
              htmlFor="image-upload"
              className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span>Change</span>
              <input
                id="image-upload"
                name="image"
                type="file"
                className="sr-only"
                accept="image/*"
                // onChange={handleInputChange}
              />
            </label>
          </div>
        </div> */}
        <div className="mt-3">
          <CreateProfileSubmitButton isValid={isValid} />
        </div>
      </form>
    </Form>
  );
}

export default CreateProfileForm;
