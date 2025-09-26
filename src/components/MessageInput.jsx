import { Image, Send, X, Loader2, AlertCircle } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const MessageInput = () => {
  const { sendMessage, selectedUser } = useChatStore();
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);

  // Built-in canvas-based image compression
  const compressImage = async (file, maxWidth = 1920, quality = 0.8) => {
    try {
      setIsCompressing(true);
      
      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = document.createElement('img');

        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxWidth) {
              width = (width * maxWidth) / height;
              height = maxWidth;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw image with better quality settings
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Show compression stats
                const originalSize = (file.size / 1024 / 1024).toFixed(2);
                const compressedSize = (blob.size / 1024 / 1024).toFixed(2);
                
                if (file.size > blob.size) {
                  toast.success(`Image compressed: ${originalSize}MB → ${compressedSize}MB`);
                }
                
                resolve(blob);
              } else {
                reject(new Error('Canvas to blob conversion failed'));
              }
              
              // Clean up
              URL.revokeObjectURL(img.src);
            },
            'image/jpeg',
            quality
          );
        };

        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          reject(new Error('Failed to load image for compression'));
        };

        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error("Compression error:", error);
      toast.error("Failed to compress image");
      throw error;
    } finally {
      setIsCompressing(false);
    }
  };

  const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB max before compression

    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP, GIF)");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("Image is too large (max 10MB)");
      return false;
    }

    return true;
  };

  const handleImageChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateImage(file)) {
      e.target.value = ''; // Reset input
      return;
    }

    try {
      let processedFile = file;
      
      // Compress if file is larger than 1MB
      if (file.size > 1024 * 1024) {
        processedFile = await compressImage(file);
      }

      setImageFile(processedFile);
      
      // Clean up previous preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setImagePreview(URL.createObjectURL(processedFile));
    } catch (error) {
      console.error("Image processing error:", error);
      toast.error("Failed to process image. Please try again.");
      e.target.value = ''; // Reset input on error
    }
  }, [imagePreview]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText && !imageFile) {
      textInputRef.current?.focus();
      return;
    }

    if (!selectedUser?._id) {
      toast.error("Please select a user to send message to");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", trimmedText);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await sendMessage(formData, selectedUser._id);
      resetForm();
      toast.success("Message sent!");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setText("");
    setImageFile(null);
    
    // Clean up preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Focus back to text input
    setTimeout(() => textInputRef.current?.focus(), 100);
  }, [imagePreview]);

  const removeImage = useCallback(() => {
    setImageFile(null);
    
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [imagePreview]);

  const handleKeyDown = (e) => {
    // Send on Enter, but allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const isDisabled = isLoading || isCompressing || (!text.trim() && !imageFile);

  return (
    <div className="bg-base-100 border-t border-base-300">
      {/* Image Preview Section */}
      {imagePreview && (
        <div className="p-4 pb-2 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg border-2 border-base-300 shadow-sm"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-error hover:bg-error/80 text-error-content rounded-full flex items-center justify-center transition-colors shadow-lg"
                disabled={isLoading}
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-base-content">
                Image ready to send
              </p>
              {imageFile && (
                <p className="text-xs text-base-content/60">
                  {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="p-4">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          {/* Hidden file input */}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isLoading || isCompressing}
          />

          {/* Image upload button */}
          <button
            type="button"
            className={`btn btn-square btn-ghost hover:btn-primary transition-all duration-200 ${
              imageFile ? 'btn-success' : ''
            } ${isCompressing ? 'loading' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isCompressing}
            aria-label="Upload image"
          >
            {isCompressing ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Image size={20} />
            )}
          </button>

          {/* Text input */}
          <div className="flex-1">
            <textarea
              ref={textInputRef}
              className="textarea textarea-bordered w-full resize-none min-h-[2.5rem] max-h-32 leading-relaxed"
              placeholder={selectedUser ? `Message ${selectedUser.fullName}...` : "Select a user to start messaging..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || isCompressing || !selectedUser}
              rows={1}
              style={{
                height: 'auto',
                minHeight: '2.5rem'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />
          </div>

          {/* Send button */}
          <button
            type="submit"
            className={`btn btn-square btn-primary transition-all duration-200 ${
              isLoading ? 'loading' : ''
            }`}
            disabled={isDisabled}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>

        {/* Status and Helper Text */}
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-base-content/50">
            {isCompressing ? (
              <span className="flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" />
                Compressing image...
              </span>
            ) : (
              "Press Enter to send • Shift+Enter for new line"
            )}
          </div>
          
          {!selectedUser && (
            <div className="flex items-center gap-1 text-xs text-warning">
              <AlertCircle size={12} />
              Select a user first
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;