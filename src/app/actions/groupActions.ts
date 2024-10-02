"use server";

import { auth } from "@/auth";
import { createGroup, updateGroupProfilePic } from "@/lib/groupOperations";
import { State } from "@/lib/types";
import { User } from "@prisma/client";
import { z } from "zod";
import { ChatformSchema } from "../(auth)/login/validation";
import prisma from "../../../prisma/prisma";

const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(50, "Group name must be 50 characters or less"),
  selectedUsers: z.string(),
  profilePic: z.any().optional(),
});

export async function createGroupAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const validatedFields = createGroupSchema.safeParse({
      name: formData.get("name"),
      selectedUsers: formData.get("selectedUsers"),
      profilePic: formData.get("profilePic"),
    });
    console.log("🚀 ~ validatedFields:", validatedFields);

    if (!validatedFields.success) {
      return {
        status: "error",
        message: "Invalid form data.",
        errors: validatedFields.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      };
    }
    const session = await auth();
    const { user } = session || {};
    if (user) {
      const { id } = user || {};

      const { name, selectedUsers } = validatedFields.data;

      await createGroup(name, id || "", JSON.parse(selectedUsers));
    }
    return {
      status: "success",
      message: "Group created successfully",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create group";
    return {
      status: "error",
      message,
    };
  }
}

export async function updateGroupProfilePicAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const groupId = formData.get("groupId") as string;
    const profilePicUrl = formData.get("profilePicUrl") as string;

    if (!groupId || !profilePicUrl) {
      return { status: "error", message: "Missing required fields" };
    }

    await updateGroupProfilePic(groupId, profilePicUrl);
    return {
      status: "success",
      message: "Group profile picture updated successfully",
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update group profile picture";
    return {
      status: "error",
      message,
    };
  }
}

export async function getUsersListAction(): Promise<State> {
  try {
    const session = await auth();
    const { user } = session || {};
    if (user) {
      const { email } = user || {};
      if (email) {
        const usersList = await prisma?.user.findMany({
          where: {
            email: { not: email },
            emailVerified: { not: null },
            isActive: true,
          },
        });
        return {
          status: "success",
          data: usersList,
          message: "Users founded",
        };
      }
    }
    return {
      status: "success",
      message: "Error while fetching users list",
    };
  } catch (error) {
    const { message = "Something went wring" } =
      (error as { message: string }) || {};
    return {
      status: "error",
      message,
    };
  }
}

export async function getRecentUsersAndGroupsListAction(): Promise<State> {
  try {
    const session = await auth();
    const { user } = session || {};
    if (user) {
      const { id } = user || {};
      if (id) {
        const groups = await prisma.group.findMany({
          where: {
            members: {
              some: {
                userId: id,
              },
            },
          },
          include: {
            members: true,
          },
        });

        return {
          status: "success",
          data: groups,
          message: "Groups found",
        };
      }
    }
    return {
      status: "success",
      message: "Error while fetching recent users and groups list",
    };
  } catch (error) {
    const { message = "Something went wrong" } =
      (error as { message: string }) || {};
    return {
      status: "error",
      message,
    };
  }
}

export async function getRecentMessagesForGroupAction(
  groupId: string
): Promise<State> {
  try {
    const messages = await prisma.message.findMany({
      where: {
        groupId: groupId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to the 50 most recent messages
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    return {
      status: "success",
      data: messages.reverse(), // Reverse to get chronological order
      message: "messeges fetched",
    };
  } catch (error) {
    console.error("Error fetching recent messages:", error);
    return {
      status: "error",
      message: "Failed to fetch recent messages",
    };
  }
}

export async function sentMessageAction(
  prevState: State,
  data: FormData
): Promise<State> {
  try {
    const input = Object.fromEntries(data);
    const response = ChatformSchema.safeParse(input);
    if (!response.success) {
      throw new Error(response.error.errors[0].message);
    }
    const session = await auth();
    const { user } = session || {};
    const { id: user_id } = (user as User) || {};
    const { group_id, message } = response.data;
    console.log("🚀 ~ response.data:", response.data);

    await prisma.message.create({
      data: {
        content: message,
        senderId: user_id,
        groupId: group_id,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      status: "success",
      message: "message sent",
    };
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return {
      status: "error",
      message: "something went wrong",
    };
  }
}
