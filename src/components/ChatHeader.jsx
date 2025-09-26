import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import { X } from 'lucide-react';

function ChatHeader() {
   const {selectedUser, setSelectedUser} = useChatStore();
   const {onlineUsers} = useAuthStore();
   
   const isOnline = onlineUsers.includes(selectedUser._id);

   return (
     <div className='p-4 border-b border-base-300 bg-base-100'>
       <div className='flex items-center justify-between'>
         <div className='flex items-center gap-3'>
           {/* Avatar with online indicator */}
           <div className='avatar relative'>
             <div className='w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
               <img 
                 src={selectedUser.profilePic || (selectedUser.gender === "male" ? "/avatar.png" : "/avatar2.png")} 
                 alt={`${selectedUser.fullName}'s profile`}
                 className='rounded-full object-cover'
               />
             </div>
             {/* Online status indicator */}
             <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${
               isOnline ? 'bg-success' : 'bg-base-300'
             }`}></div>
           </div>
           
           {/* User info */}
           <div className='flex flex-col'>
             <h3 className='font-semibold text-base-content text-lg'>
               {selectedUser.fullName}
             </h3>
             <div className='flex items-center gap-1'>
               <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-base-300'}`}></div>
               <p className={`text-sm font-medium ${
                 isOnline ? 'text-success' : 'text-base-content/60'
               }`}>
                 {isOnline ? "Online" : "Offline"}
               </p>
             </div>
           </div>
         </div>

         {/* Close button */}
         <button 
           onClick={() => setSelectedUser(null)}
           className='btn btn-ghost btn-sm btn-circle hover:bg-base-200 transition-colors duration-200'
           aria-label='Close chat'
         >
           <X size={20} className='text-base-content/70 hover:text-base-content' />
         </button>
       </div>
     </div>
   )
}

export default ChatHeader