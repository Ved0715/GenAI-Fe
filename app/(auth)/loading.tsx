export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20"></div>

      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Animated Flox logo */}
        <div className="relative">
          <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl animate-ping opacity-20"></div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">Authenticating</h3>
          <p className="text-gray-400 text-sm">Verifying your credentials...</p>
        </div>

        {/* Elegant loading animation */}
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}