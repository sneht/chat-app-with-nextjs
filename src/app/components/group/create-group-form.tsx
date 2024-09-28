"use client";

import { createGroupAction } from "@/app/actions/groupActions";
import { Button } from "@/app/components/ui/button/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CreateGroupFormProps {
  selectedUsers: string[];
  onBack: () => void;
  onClose: () => void;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(50, "Group name must be 50 characters or less"),
  profilePic: z.any().optional(),
});

export default function CreateGroupForm({
  selectedUsers,
  onBack,
  onClose,
}: CreateGroupFormProps) {
  const [state, formAction] = useFormState<State, FormData>(
    createGroupAction,
    null
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      name: "",
      profilePic: "",
    },
  });

  const {
    setError,
    reset,
    control,
    watch,
    setValue,
    formState: { isValid },
  } = form;

  const profilePic = watch("profilePic");

  useEffect(() => {
    if (profilePic && profilePic[0]) {
      const file = profilePic[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  }, [profilePic]);

  useEffect(() => {
    if (!state) return;
    if (state.status === "success") {
      console.log(state.message);
      reset();
      onClose();
    }
    if (state.status === "error") {
      console.error(state.message);
      if (state.errors) {
        state.errors.forEach((error) => {
          setError(error.path as any, { message: error.message });
        });
      } else {
        setError("name", { message: state.message });
      }
    }
  }, [state, setError, reset, onClose]);

  return (
    <Form {...form}>
      <form action={formAction} className="p-4">
        <input
          type="hidden"
          name="selectedUsers"
          value={JSON.stringify(selectedUsers)}
        />
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {previewImage ? (
                <>
                  <Image
                    src={previewImage}
                    alt="Group profile"
                    layout="fill"
                    objectFit="cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue("profilePic", undefined)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <label
                  htmlFor="profilePic"
                  className="flex items-center justify-center w-full h-full cursor-pointer"
                >
                  <Camera size={32} className="text-gray-400" />
                </label>
              )}
            </div>
          </div>
          <FormField
            control={control}
            name="profilePic"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="profilePic"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onChange(e.target.files)}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter group name" {...field} />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button type="button" onClick={onBack} variant="outline">
            Back
          </Button>
          <Button type="submit" disabled={!isValid}>
            Create Group
          </Button>
        </div>
      </form>
    </Form>
  );
}
