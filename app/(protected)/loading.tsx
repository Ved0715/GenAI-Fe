export default function ProtectedLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Flox logo */}
        <div className="relative">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
            <span className="text-white font-bold text-3xl">F</span>
          </div>
          <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl animate-ping"></div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-white">Loading Dashboard</h3>
          <p className="text-gray-400">Preparing your workspace...</p>
        </div>

        {/* Loading spinner */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-75"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-150"></div>
        </div>
      </div>
    </div>
  );
}