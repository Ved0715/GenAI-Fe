export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        {/* Main Flox branding */}
        <div className="relative">
          {/* Main logo */}
          <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-4xl">F</span>
          </div>

          {/* Animated rings */}
          <div className="absolute -inset-4 border-2 border-blue-500/30 rounded-full animate-ping"></div>
          <div className="absolute -inset-8 border border-purple-500/20 rounded-full animate-ping delay-75"></div>
        </div>

        {/* Flox text with animation */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
            FLOX
          </h1>
          <p className="text-gray-400 text-lg">Loading your experience...</p>
        </div>

        {/* Premium loading indicator */}
        <div className="flex space-x-3">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce delay-200"></div>
        </div>

        {/* Loading bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}