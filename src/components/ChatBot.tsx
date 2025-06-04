
import { useState, useRef, useEffect } from "react";
import { Send, Settings, Bot, User, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { SettingsPanel } from "./SettingsPanel";
import { Message } from "./Message";
import { FAQBot } from "./FAQBot";
import { sendToOpenAI } from "@/utils/openai";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSettings {
  context: string;
  role: string;
  constraints: string;
  apiKey: string;
  model: string;
}

export function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFAQMode, setIsFAQMode] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    context: "You are a helpful AI assistant.",
    role: "assistant",
    constraints: "Be helpful, harmless, and honest.",
    apiKey: "",
    model: "gpt-4o-mini"
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (isFAQMode) {
      // FAQ mode - handle with FAQBot
      return;
    }

    // AI mode - existing logic
    if (!settings.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key in the settings panel.",
        variant: "destructive"
      });
      setShowSettings(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = `${settings.context}\n\nRole: ${settings.role}\n\nConstraints: ${settings.constraints}`;
      const response = await sendToOpenAI(
        [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        systemPrompt,
        settings.apiKey,
        settings.model
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      toast({
        title: "Error",
        description: "Failed to get response from OpenAI. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeToggle = () => {
    setIsFAQMode(!isFAQMode);
    setMessages([]); // Clear messages when switching modes
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isFAQMode 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}>
              {isFAQMode ? (
                <HelpCircle className="w-6 h-6 text-white" />
              ) : (
                <Bot className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {isFAQMode ? 'FAQ Assistant' : 'AI Assistant'}
              </h1>
              <p className="text-sm text-gray-500">
                {isFAQMode ? 'Frequently Asked Questions' : 'Powered by OpenAI'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">AI</span>
              <Toggle 
                pressed={isFAQMode}
                onPressedChange={handleModeToggle}
                className="data-[state=on]:bg-green-500"
              />
              <span className="text-sm text-gray-600">FAQ</span>
            </div>
            {!isFAQMode && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSettings(true)}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            )}
          </div>
        </div>

        {/* Chat Content */}
        {isFAQMode ? (
          <FAQBot />
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to AI Assistant</h2>
                  <p className="text-gray-600 max-w-md">
                    Start a conversation with your AI assistant. You can customize its behavior using the settings panel.
                  </p>
                </div>
              )}
              
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t bg-white p-4">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
