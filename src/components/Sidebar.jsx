import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, Filter } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on search and online status
  const filteredUsers = users
    .filter((user) => 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => 
      showOnlineOnly ? onlineUsers.includes(user._id) : true
    );

  const onlineCount = onlineUsers.length > 0 ? onlineUsers.length - 1 : 0;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-4 bg-base-200/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="size-5 text-primary" />
          </div>
          <div className="hidden lg:block">
            <h2 className="font-semibold text-lg">Contacts</h2>
            <p className="text-sm text-base-content/60">
              {users.length} contact{users.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Search bar - only on large screens */}
        <div className="hidden lg:block mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 size-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-sm w-full pl-10 bg-base-100 border-base-300 focus:border-primary"
            />
          </div>
        </div>

        {/* Online filter toggle */}
        <div className="hidden lg:flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-primary checkbox-sm"
            />
            <span className="text-sm font-medium">Online only</span>
          </label>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-base-content/60 font-medium">
              {onlineCount} online
            </span>
          </div>
        </div>

        {/* Mobile filter button */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowOnlineOnly(!showOnlineOnly)}
            className={`btn btn-sm btn-circle ${showOnlineOnly ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Filter className="size-4" />
          </button>
        </div>
      </div>

      {/* Users list */}
      <div className="overflow-y-auto w-full flex-1">
        <div className="p-2">
          {filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;
            
            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
                  w-full p-3 flex items-center gap-3 rounded-lg mb-1
                  transition-all duration-200 hover:bg-base-200
                  ${isSelected 
                    ? "bg-primary/10 border border-primary/20 shadow-sm" 
                    : "hover:shadow-sm"
                  }
                `}
              >
                <div className="relative mx-auto lg:mx-0 flex-shrink-0">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full ring-2 ring-base-300">
                      <img
                        src={user.profilePic || (user.gender === "male" ? "/avatar.png" : "/avatar2.png")}
                        alt={`${user.fullName}'s avatar`}
                        className="rounded-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Online status indicator */}
                  <div className={`
                    absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-base-100
                    ${isOnline ? 'bg-success' : 'bg-base-300'}
                    transition-colors duration-200
                  `}></div>
                </div>

                {/* User info - only visible on larger screens */}
                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className={`font-medium truncate ${
                    isSelected ? 'text-primary' : 'text-base-content'
                  }`}>
                    {user.fullName}
                  </div>
                  <div className={`text-sm flex items-center gap-1 ${
                    isOnline ? 'text-success' : 'text-base-content/60'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isOnline ? 'bg-success' : 'bg-base-300'
                    }`}></div>
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty states */}
        {filteredUsers.length === 0 && searchTerm && (
          <div className="text-center py-8 px-4">
            <div className="text-base-content/40 mb-2">
              <Search className="size-12 mx-auto mb-3" />
            </div>
            <p className="text-base-content/60 font-medium">No contacts found</p>
            <p className="text-sm text-base-content/40">
              Try searching with a different name
            </p>
          </div>
        )}

        {filteredUsers.length === 0 && showOnlineOnly && !searchTerm && (
          <div className="text-center py-8 px-4">
            <div className="text-base-content/40 mb-2">
              <Users className="size-12 mx-auto mb-3" />
            </div>
            <p className="text-base-content/60 font-medium">No one is online</p>
            <p className="text-sm text-base-content/40">
              Check back later or turn off the online filter
            </p>
          </div>
        )}

        {users.length === 0 && (
          <div className="text-center py-8 px-4">
            <div className="text-base-content/40 mb-2">
              <Users className="size-12 mx-auto mb-3" />
            </div>
            <p className="text-base-content/60 font-medium">No contacts yet</p>
            <p className="text-sm text-base-content/40">
              Start by adding some friends
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;