import {
  getRecentMessagesForGroupAction,
  sentMessageAction,
} from "@/app/actions/groupActions";
import { State } from "@/lib/types";
import { socket } from "@/socket";
import { zodResolver } from "@hookform/resolvers/zod";
import { Group, User } from "@prisma/client";
import { ArrowLeft, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form/form";
import { ChatformSchema } from "@/app/(auth)/login/validation";
import { Input } from "../ui/input/input";

interface ChatViewProps {
  chat: Group;
  onBack: () => void;
}

function ChatView({ chat, onBack }: ChatViewProps) {
  const session = useSession();
  const { data } = session || {};
  const { user } = (data as unknown as { user: User }) || {};
  const { id: user_id } = user || {};
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesColumnRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof ChatformSchema>>({
    resolver: zodResolver(ChatformSchema),
    defaultValues: {
      group_id: chat.id,
      message: "",
    },
  });

  useEffect(() => {
    form.setValue("group_id", chat?.id);
  }, [form, chat]);

  const [state, formAction] = useFormState<State, FormData>(
    sentMessageAction,
    null
  );

  const scrollToBottom = () => {
    if (messagesColumnRef.current) {
      messagesColumnRef.current.scrollTop =
        messagesColumnRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      scrollToBottom();
      console.log("received data from socket", data);
      const { message, from, to } = data || {};
      const newMessage = {
        id: Date.now().toString(), // Use a proper ID in production
        content: message,
        groupId: to,
        senderId: from,
        sender: from === user_id ? user : { id: from, username: user.username }, // You might want to fetch the actual user data
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [user_id, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      const result = await getRecentMessagesForGroupAction(chat.id);
      if (result) {
        if (result?.status === "success") {
          console.log("result.data", result.data);
          setMessages(result.data);
          // Scroll to bottom after messages are loaded
          setTimeout(scrollToBottom, 0);
        } else {
          console.log(result.message);
        }
      } else {
        console.log("error while fetching recent message of group");
      }
    };

    fetchMessages();
  }, [chat.id]);

  const sendMessage = (data: FormData) => {
    if (socket.connected) {
      const message = form.getValues("message");
      //   const newMessage = {
      //     id: Date.now().toString(), // Use a proper ID in production
      //     content: message,
      //     groupId: chat.id,
      //     senderId: user_id,
      //     sender: user,
      //   };
      //   setMessages((prevMessages) => [...prevMessages, newMessage]);

      form.reset();
      formAction(data);
      socket.emit("message_sent", {
        from: user_id,
        to: chat?.id,
        message: message,
      });
      scrollToBottom();
    }
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
      <div className="flex-1 overflow-y-auto p-4" ref={messagesColumnRef}>
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
              <p
                className={`text-xs ${
                  message.sender.id === user?.id
                    ? "text-white"
                    : "text-gray-500"
                }`}
              >
                {message.sender.id === user?.id ? "" : message.sender.username}
              </p>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <Form {...form}>
        <form action={sendMessage}>
          <div className="p-4 bg-white">
            <div className="flex w-full">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          className="flex-1 mr-2 p-2 border rounded w-full"
                          placeholder="Type a message"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <input type="hidden" {...form.register("group_id")} />

              <button
                className="bg-blue-500 text-white p-2 rounded"
                type="submit"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ChatView;
