import React from 'react'
import { useThemeStore } from '../store/useThemeStore'
import { THEMES } from '../constants'
import { Send, Palette, Eye, Check, Sparkles } from 'lucide-react'

const PREVIEW_MESSAGES = [
  {id: 1, content: "Hi! How's it going?", isSent: false, time: "12:00 PM"}, 
  {id: 2, content: "I'm doing great! Just working on some new features 🚀", isSent: true, time: "12:01 PM"},
  {id: 3, content: "That sounds exciting! What kind of features?", isSent: false, time: "12:02 PM"},
  {id: 4, content: "Theme customization and better UI components!", isSent: true, time: "12:03 PM"}
]

function SettingsPage() {
  const { theme, setTheme } = useThemeStore();

  const getThemeDisplayName = (themeName) => {
    return themeName.charAt(0).toUpperCase() + themeName.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 pt-20'>
      <div className='container mx-auto px-4 max-w-6xl'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='bg-base-100 rounded-2xl shadow-xl border border-base-300'>
            <div className='bg-gradient-to-r from-primary to-secondary rounded-t-2xl p-6'>
              <div className='flex items-center gap-4'>
                <div className='p-3 bg-white/10 rounded-xl backdrop-blur-sm'>
                  <Palette className='w-8 h-8 text-white' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-white'>Theme Settings</h1>
                  <p className='text-white/80 mt-1'>Customize your chat experience with beautiful themes</p>
                </div>
              </div>
            </div>
            
            <div className='p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Sparkles className='w-5 h-5 text-primary' />
                <h2 className='text-xl font-semibold'>Choose Your Theme</h2>
                <div className='badge badge-primary badge-sm ml-2'>{THEMES.length} themes</div>
              </div>
              <p className='text-base-content/70 mb-6'>
                Select from our collection of carefully crafted themes to match your style and mood.
              </p>

              {/* Theme Grid */}
              <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4'>
                {THEMES.map((t) => (
                  <button 
                    key={t}
                    className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105
                      ${theme === t 
                        ? "bg-primary/10 border-2 border-primary shadow-lg ring-2 ring-primary/20" 
                        : "bg-base-200/50 border-2 border-transparent hover:bg-base-200 hover:shadow-md"
                      }`}
                    onClick={() => setTheme(t)}
                  >
                    {/* Theme Preview */}
                    <div className='relative h-12 w-full rounded-lg overflow-hidden shadow-sm border border-base-300' data-theme={t}>
                      <div className='absolute inset-0 grid grid-cols-4 gap-0.5 p-1'>
                        <div className='rounded-sm bg-primary'></div>
                        <div className='rounded-sm bg-secondary'></div>
                        <div className='rounded-sm bg-accent'></div>
                        <div className='rounded-sm bg-neutral'></div>
                      </div>
                    </div>
                    
                    {/* Theme Name */}
                    <span className='text-xs font-semibold text-center leading-tight'>
                      {getThemeDisplayName(t)}
                    </span>
                    
                    {/* Selected Indicator */}
                    {theme === t && (
                      <div className='absolute -top-2 -right-2 bg-primary text-primary-content rounded-full p-1 shadow-lg'>
                        <Check className='w-3 h-3' />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className='bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden'>
          <div className='bg-base-200 p-6 border-b border-base-300'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-info/10 rounded-lg'>
                <Eye className='w-5 h-5 text-info' />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Live Preview</h3>
                <p className='text-sm text-base-content/70'>See how your selected theme looks in action</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-base-200/30">
            <div className="max-w-2xl mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-base-300 bg-gradient-to-r from-base-100 to-base-200">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                        J
                      </div>
                    </div>
                    <div className='flex-1'>
                      <h3 className="font-semibold text-base">John Doe</h3>
                      <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-success rounded-full'></div>
                        <p className="text-sm text-success font-medium">Online</p>
                      </div>
                    </div>
                    <div className='text-xs text-base-content/60'>
                      Theme: {getThemeDisplayName(theme)}
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-4 min-h-[300px] max-h-[300px] overflow-y-auto bg-gradient-to-b from-base-100 to-base-50">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div className={`flex items-end gap-2 max-w-[80%] ${message.isSent ? "flex-row-reverse" : ""}`}>
                        {!message.isSent && (
                          <div className="w-6 h-6 rounded-full bg-base-300 flex-shrink-0"></div>
                        )}
                        <div
                          className={`
                            rounded-2xl px-4 py-3 shadow-sm border
                            ${message.isSent 
                              ? "bg-primary text-primary-content border-primary/20 rounded-br-md" 
                              : "bg-base-200 border-base-300 rounded-bl-md"
                            }
                          `}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.isSent ? "text-primary-content/70" : "text-base-content/70"
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm bg-base-200 border-base-300 focus:border-primary"
                      placeholder="Type your message here..."
                      value="This is a live preview of your selected theme! ✨"
                      readOnly
                    />
                    <button className="btn btn-primary btn-square shadow-lg hover:shadow-xl transition-shadow">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Info Footer */}
        <div className='mt-6 text-center text-base-content/60 text-sm'>
          <p>💡 Themes are applied instantly and saved automatically</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage