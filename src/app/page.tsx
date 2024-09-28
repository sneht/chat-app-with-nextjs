"use client";

import CreateGroupForm from "@/app/components/group/create-group-form";
import { Group, User } from "@prisma/client";
import {
  ArrowLeft,
  ChevronRight,
  LogOut,
  MoreVertical,
  Search,
  Send,
  Settings,
  User as UserIcon,
  UserPlus,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import {
  getRecentMessagesForGroupAction,
  getRecentUsersAndGroupsListAction,
  getUsersListAction,
} from "./actions/groupActions";
import { Sidebar } from "./components/sidebar/sidebar";
import Loading from "./loading";

// Sidebar Component

// ChatView Component
interface ChatViewProps {
  chat: Group;
  onBack: () => void;
}

function ChatView({ chat, onBack }: ChatViewProps) {
  const session = useSession();
  // const { socket } = useContext(SocketContext);
  const { data } = session || {};
  const { user } = (data as unknown as { user: User }) || {};
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  // const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const result = await getRecentMessagesForGroupAction(chat.id);
      if (result) {
        if (result?.status === "success") {
          console.log("result.data", result.data);
          setMessages(result.data);
        } else {
          console.log(result.message);
        }
      } else {
        console.log("error while fetching recent message of group");
      }
    };

    fetchMessages();
  }, [chat.id]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      console.log("inputMessage",inputMessage)
    }
    // if (inputMessage.trim() && socketRef.current && user) {
    //   console.log("message emited");
    //   socketRef.current.emit("sendMessage", {
    //     groupId: chat.id,
    //     senderId: user.id,
    //     content: inputMessage.trim(),
    //   });
    //   setInputMessage("");
    // }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-200 p-4 flex items-center">
        <button onClick={onBack} className="mr-2 md:hidden">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
          {chat.name.charAt(0)}
        </div>
        <h2 className="font-semibold">{chat.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender.id === user?.id ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender.id === user?.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <p className="text-xs text-gray-500">{message.sender.username}</p>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white">
        <div className="flex">
          <input
            type="text"
            className="flex-1 mr-2 p-2 border rounded"
            placeholder="Type a message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={sendMessage}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface DropdownMenuProps {
  onCreateGroup: () => void;
}

function DropdownMenu({ onCreateGroup }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCreateGroup = () => {
    onCreateGroup();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full hover:bg-gray-300"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button
                onClick={handleCreateGroup}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <UserPlus className="inline-block mr-2 h-4 w-4" />
                Create Group
              </button>
            </li>
            <li>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                <Settings className="inline-block mr-2 h-4 w-4" />
                Settings
              </button>
            </li>
            <li>
              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                <LogOut className="inline-block mr-2 h-4 w-4" />
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

// CreateGroupModal Component
interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  usersList: User[];
}

function CreateGroupModal({
  isOpen,
  onClose,
  usersList,
}: CreateGroupModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [step, setStep] = useState<"select-users" | "create-group">(
    "select-users"
  );

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleNext = () => {
    setStep("create-group");
  };

  const handleBack = () => {
    setStep("select-users");
  };

  const handleClose = () => {
    setStep("select-users");
    setSelectedUsers([]);
    onClose();
  };

  if (!isOpen) return null;

  const filteredUsers = usersList.filter((user) =>
    user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {step === "select-users"
              ? "Select Group Members"
              : "Create New Group"}
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {step === "select-users" ? (
          <div className="p-4">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border rounded-full"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <div className="max-h-60 overflow-y-auto mb-4 space-y-2">
              {filteredUsers.map((user) => {
                const { id, username, profileImage } = user || {};
                return (
                  <div
                    key={id}
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedUsers.includes(id)
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleUserToggle(id)}
                  >
                    <div className="relative w-10 h-10 mr-3">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt={username || ""}
                          layout="fill"
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                          <UserIcon size={20} className="text-gray-600" />
                        </div>
                      )}
                      {selectedUsers.includes(id) && (
                        <div className="absolute -right-1 -bottom-1 bg-green-500 rounded-full p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="flex-grow">{username}</span>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(id)}
                      onChange={() => {}}
                      className="sr-only"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {selectedUsers.length} user
                {selectedUsers.length !== 1 ? "s" : ""} selected
              </div>
              <button
                onClick={handleNext}
                disabled={selectedUsers.length === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          </div>
        ) : (
          <CreateGroupForm
            selectedUsers={selectedUsers}
            onBack={handleBack}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}

// Main App Component
export default function Home() {
  const session = useSession();
  const { status } = session || {};
  const [selectedChat, setSelectedChat] = useState<Group | null>(null);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [usersList, setUsersList] = useState([] as User[]);
  const [groupList, setGroupList] = useState([] as Group[]);

  useEffect(() => {
    const getUsersList = async () => {
      const res = await getUsersListAction();
      const { status, message, data } =
        (res as { status: "success" | "error"; message: string; data?: any }) ||
        {};
      if (status === "success") {
        setUsersList(data);
      } else {
        console.log(message);
      }
    };
    getUsersList();
  }, []);

  useEffect(() => {
    const getRecentUsersAndGroupsList = async () => {
      const res = await getRecentUsersAndGroupsListAction();
      const { status, message, data } =
        (res as { status: "success" | "error"; message: string; data?: any }) ||
        {};
      if (status === "success") {
        setGroupList(data);
      }
    };
    getRecentUsersAndGroupsList();
  }, []);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleSelectChat = (chat: Group) => {
    setSelectedChat(chat);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const handleCreateGroup = () => {
    setIsCreateGroupModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {status === "loading" ? (
        <Loading />
      ) : (
        <>
          <div
            className={`bg-white ${
              isMobile && selectedChat ? "hidden" : "w-full md:w-1/3"
            } md:block`}
          >
            <div className="flex justify-between items-center p-4 bg-gray-200">
              <h1 className="text-xl font-semibold">Chat App</h1>
              <DropdownMenu onCreateGroup={handleCreateGroup} />
            </div>
            <Sidebar chats={groupList} onSelectChat={handleSelectChat} />
          </div>
          <div
            className={`flex-1 ${
              isMobile && !selectedChat ? "hidden" : "block"
            }`}
          >
            {selectedChat ? (
              <ChatView chat={selectedChat} onBack={handleBackToList} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </div>
          <CreateGroupModal
            isOpen={isCreateGroupModalOpen}
            onClose={() => setIsCreateGroupModalOpen(false)}
            usersList={usersList}
          />
        </>
      )}
    </div>
  );
}
