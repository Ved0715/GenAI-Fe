'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Chat } from '@/components/chat/Chat';
import { use } from 'react';

interface ChatPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { user } = useAuth();
  const { userId } = use(params);

  return <Chat userId={userId} currentUser={user} />;
}