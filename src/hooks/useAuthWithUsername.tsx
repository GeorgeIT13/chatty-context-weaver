
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface AuthHookProps {
  onAuthSuccess: (user: User) => void;
}

export function useAuthWithUsername({ onAuthSuccess }: AuthHookProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const signUp = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username
          }
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    setIsLoading(true);
    try {
      let email = emailOrUsername;
      
      // Check if it's a username (no @ symbol)
      if (!emailOrUsername.includes('@')) {
        // Get email from username
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', emailOrUsername)
          .single();
        
        if (!profile) {
          throw new Error('Username not found');
        }

        // Get the email from auth.users using the user ID
        const { data: user } = await supabase.auth.admin.getUserById(profile.id);
        if (!user?.user?.email) {
          throw new Error('Unable to find email for this username');
        }
        email = user.user.email;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        onAuthSuccess(data.user);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    isLoading
  };
}
