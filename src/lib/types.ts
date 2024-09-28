import { Group } from "@prisma/client";

export type State =
  | {
      status: "success";
      message: string;
      data?: any;
    }
  | {
      status: "error";
      message: string;
      errors?: Error[];
    }
  | null;

export interface Error {
  path: string;
  message: string;
}

export interface LoginResponse {
  error: string;
  ok: boolean;
  status: number;
  url: string | null;
}

export interface ErrorProps {
  message?: string;
}

export interface SidebarProps {
  chats: Group[];
  onSelectChat: (chat: Group) => void;
}

// Types
export type Message = {
  sender: string;
  text: string;
};

// export type Chat = {
//   id: number;
//   name: string;
//   profilePic: string;
//   lastMessage: string;
//   messages: Message[];
// };

export type User = {
  id: number;
  name: string;
  profilePic: string;
};
