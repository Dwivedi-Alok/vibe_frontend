import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';

function ChatContainer() {
  const { 
    messages, 
    getMessages, 
    isMessageLoading, 
    selectedUser,
    subscribeToMessages, 
    unsubscribeFromMessages 
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Track if user was at bottom before new message
  const wasAtBottomRef = useRef(true);

  // Memoized function to check if user is at bottom
  const isAtBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const threshold = 100; // Increased threshold for better detection
    return Math.abs(scrollHeight - clientHeight - scrollTop) < threshold;
  }, []);

  // Enhanced scroll to bottom function
  const scrollToBottom = useCallback((force = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  // Track scroll position to remember if user was at bottom
  const handleScroll = useCallback(() => {
    wasAtBottomRef.current = isAtBottom();
  }, [isAtBottom]);

  // Fetch messages with cleanup
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Always scroll to bottom for new conversations or if user was at bottom
      if (wasAtBottomRef.current) {
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      }
    }
  }, [messages, scrollToBottom]);

  // Initial scroll to bottom when conversation loads
  useEffect(() => {
    if (selectedUser?._id && messages.length > 0) {
      // Force scroll to bottom when switching conversations
      wasAtBottomRef.current = true;
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [selectedUser?._id, scrollToBottom]);

  // Format time helper
  const formatMessageTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      // Today - show only time
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    } else if (messageDate.getTime() === today.getTime() - 86400000) {
      // Yesterday
      return `Yesterday ${date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      })}`;
    } else {
      // Older - show date and time
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  }, []);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentDate = null;
    
    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();
      
      if (messageDate !== currentDate) {
        groups.push({
          type: 'date',
          date: messageDate,
          displayDate: new Date(message.createdAt).toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        });
        currentDate = messageDate;
      }
      
      groups.push({
        type: 'message',
        ...message
      });
    });
    
    return groups;
  }, [messages]);

  // Loading state
  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  // No user selected state
  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-base-100">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-base-200 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-base-content/40" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-base-content">
              Welcome to Chat
            </h3>
            <p className="text-base-content/60">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-base-100">
      <ChatHeader />
      
      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-2"
        onScroll={handleScroll}
      >
        <div className="space-y-2 max-w-4xl mx-auto">
          {groupedMessages.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-base-content/40" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-base-content/60">No messages yet</p>
                <p className="text-sm text-base-content/40">
                  Start the conversation with {selectedUser.fullName}
                </p>
              </div>
            </div>
          ) : (
            groupedMessages.map((item, index) => {
              if (item.type === 'date') {
                return (
                  <div key={`date-${index}`} className="flex justify-center my-6">
                    <div className="divider divider-neutral text-xs font-medium">
                      {item.displayDate}
                    </div>
                  </div>
                );
              }

              const isOwn = item.senderId === authUser._id;
              const sender = isOwn ? authUser : selectedUser;
              
              return (
                <div
                  key={item._id}
                  className={`chat ${isOwn ? 'chat-end' : 'chat-start'}`}
                >
                  {/* Avatar */}
                  <div className="chat-image avatar">
                    <div className="w-10 h-10 rounded-full ring-2 ring-base-300 ring-offset-2 ring-offset-base-100">
                      <img
                        src={sender.profilePic || '/default-avatar.png'}
                        alt={`${sender.fullName}'s avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="chat-header mb-1">
                    <span className="text-sm font-medium text-base-content/80">
                      {isOwn ? 'You' : sender.fullName}
                    </span>
                    <time className="text-xs text-base-content/50 ml-2">
                      {formatMessageTime(item.createdAt)}
                    </time>
                  </div>

                  {/* Message Bubble */}
                  <div className={`chat-bubble max-w-xs sm:max-w-md lg:max-w-lg break-words ${
                    isOwn 
                      ? 'chat-bubble-primary' 
                      : 'chat-bubble-secondary'
                  }`}>
                    {/* Image attachment */}
                    {item.image && (
                      <div className="mb-2">
                        <a 
                          href={item.image} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={item.image}
                            alt="Message attachment"
                            className="max-w-full h-auto max-h-64 object-cover cursor-pointer"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </a>
                      </div>
                    )}
                    
                    {/* Text content */}
                    {item.text && (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {item.text}
                      </div>
                    )}
                  </div>

                  {/* Message status (for own messages) */}
                  {isOwn && (
                    <div className="chat-footer opacity-50">
                      <div className="flex items-center space-x-1 text-xs">
                        {/* You can add delivery/read status here */}
                        <span>Sent</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {messages.length > 10 && (
        <div className="absolute bottom-20 right-6 z-10">
          <button
            onClick={() => scrollToBottom(true)}
            className="btn btn-circle btn-sm btn-primary shadow-lg hover:shadow-xl transition-all"
            aria-label="Scroll to bottom"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </button>
        </div>
      )}

      <MessageInput />
    </div>
  );
}

export default ChatContainer;