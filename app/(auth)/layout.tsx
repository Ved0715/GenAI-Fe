import { AuthProvider } from '@/contexts/AuthContext';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="auth-layout">
        {children}
      </div>
    </AuthProvider>
  );
}