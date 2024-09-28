import { SidebarProps } from "@/lib/types";

export function Sidebar({ chats, onSelectChat }: SidebarProps) {
  return (
    <div className="overflow-y-auto h-[calc(100vh-64px)]">
      {chats?.map((chat) => (
        <div
          key={chat.id}
          className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelectChat(chat)}
        >
          <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
            {chat.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold">{chat.name}</h2>
            {/* <p className="text-sm text-gray-500">{chat.lastMessage}</p> */}
          </div>
        </div>
      ))}
    </div>
  );
}
