import prisma from "../../prisma/prisma";

// Create a new group
export async function createGroup(
  name: string,
  creatorId: string,
  selectedUsers: number[]
) {
  const group = await prisma.group.create({
    data: {
      name,
      members: {
        create: [
          {
            userId: creatorId,
            isAdmin: true,
          },
          ...selectedUsers.map((userId) => ({
            userId: userId.toString(),
            isAdmin: false,
          })),
        ],
      },
    },
    include: {
      members: true,
    },
  });
  return group;
}

// Update group details
export async function updateGroup(groupId: string, name: string) {
  const updatedGroup = await prisma.group.update({
    where: { id: groupId },
    data: { name },
  });
  return updatedGroup;
}

// Add member to group
export async function addMemberToGroup(
  groupId: string,
  userId: string,
  isAdmin: boolean = false
) {
  const groupMember = await prisma.groupMember.create({
    data: {
      group: { connect: { id: groupId } },
      user: { connect: { id: userId } },
      isAdmin,
    },
  });
  return groupMember;
}

// Remove member from group
export async function removeMemberFromGroup(groupId: string, userId: string) {
  const removedMember = await prisma.groupMember.delete({
    where: {
      userId_groupId: {
        userId,
        groupId,
      },
    },
  });
  return removedMember;
}

// Delete group (admin only)
export async function deleteGroup(groupId: string, adminId: string) {
  // First, check if the user is an admin
  const isAdmin = await prisma.groupMember.findFirst({
    where: {
      groupId,
      userId: adminId,
      isAdmin: true,
    },
  });

  if (!isAdmin) {
    throw new Error("Only admins can delete the group");
  }

  // Delete the group and all associated members
  const deletedGroup = await prisma.group.delete({
    where: { id: groupId },
    include: { members: true },
  });

  return deletedGroup;
}

// Get group details
export async function getGroupDetails(groupId: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });
  return group;
}

// Update group profile picture
export async function updateGroupProfilePic(
  groupId: string,
  profilePicUrl: string
) {
  const updatedGroup = await prisma.group.update({
    where: { id: groupId },
    data: { profileImage: profilePicUrl },
  });
  return updatedGroup;
}
