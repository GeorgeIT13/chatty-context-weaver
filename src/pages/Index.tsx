
import { useState } from "react";
import { ChatBot } from "@/components/ChatBot";
import { AuthPage } from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@supabase/supabase-js";

const Index = () => {
  const { user, loading } = useAuth();
  const [authUser, setAuthUser] = useState<User | null>(null);

  const handleAuthSuccess = (user: User) => {
    setAuthUser(user);
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !authUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <ChatBot />
    </div>
  );
};

export default Index;
