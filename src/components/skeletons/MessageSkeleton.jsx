const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          {/* Avatar */}
          <div className="chat-image avatar">
            <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
          </div>

          {/* Message bubble */}
          <div className="chat-bubble p-2 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse max-w-[70%]">
            {/* Header (optional name) */}
            <div className="h-4 w-24 rounded-full bg-gray-300 mb-2" />
            {/* Message content */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full bg-gray-300" />
              <div className="h-4 w-5/6 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
