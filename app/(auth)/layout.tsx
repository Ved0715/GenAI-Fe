import { AuthProvider } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),_transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(255,119,198,0.3),_transparent_50%),radial-gradient(circle_at_40%_40%,_rgba(120,200,255,0.2),_transparent_50%)]" />

        {/* Auth Card */}
        <div className="relative w-full max-w-md">
          <Card className="border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1 pb-8 pt-8">
              <div className="flex items-center justify-center space-x-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <span className="text-2xl font-bold text-white">F</span>
                </div>
                <span className="text-2xl font-bold tracking-tight">Flox</span>
              </div>
            </CardHeader>
            <CardContent className="pb-8">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthProvider>
  );
}