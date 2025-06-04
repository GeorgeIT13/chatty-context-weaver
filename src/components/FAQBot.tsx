
import { useState, useRef, useEffect } from "react";
import { Send, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "./Message";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
}

const faqData: FAQItem[] = [
  {
    question: "What is this chatbot?",
    answer: "This is an AI-powered chatbot that can operate in two modes: AI mode (powered by OpenAI) and FAQ mode for quick answers to common questions.",
    keywords: ["chatbot", "what", "this", "about"]
  },
  {
    question: "How do I switch between AI and FAQ mode?",
    answer: "Use the toggle button in the header to switch between AI and FAQ modes. AI mode requires an OpenAI API key, while FAQ mode works instantly.",
    keywords: ["switch", "toggle", "mode", "ai", "faq", "change"]
  },
  {
    question: "Do I need an API key for FAQ mode?",
    answer: "No, FAQ mode doesn't require any API key. It works with predefined questions and answers. Only AI mode requires an OpenAI API key.",
    keywords: ["api", "key", "faq", "need", "required"]
  },
  {
    question: "How do I get an OpenAI API key?",
    answer: "You can get an OpenAI API key by signing up at https://platform.openai.com/ and creating an API key in your dashboard.",
    keywords: ["openai", "api", "key", "get", "obtain", "create"]
  },
  {
    question: "What can I customize in AI mode?",
    answer: "In AI mode, you can customize the context, role, constraints, and choose different models like GPT-4o Mini or GPT-4o through the settings panel.",
    keywords: ["customize", "ai", "settings", "context", "role", "constraints"]
  },
  {
    question: "Is my data secure?",
    answer: "Yes, your API key is stored locally in your browser and never sent to our servers. Only you have access to your conversations and settings.",
    keywords: ["secure", "data", "privacy", "safe", "api", "key"]
  }
];

export function FAQBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestMatch = (query: string): FAQItem | null => {
    const lowerQuery = query.toLowerCase();
    let bestMatch: FAQItem | null = null;
    let maxMatches = 0;

    for (const faq of faqData) {
      let matches = 0;
      for (const keyword of faq.keywords) {
        if (lowerQuery.includes(keyword)) {
          matches++;
        }
      }
      
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = faq;
      }
    }

    return maxMatches > 0 ? bestMatch : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    const bestMatch = findBestMatch(input.trim());
    
    let responseContent: string;
    if (bestMatch) {
      responseContent = bestMatch.answer;
    } else {
      responseContent = `I'm sorry, I couldn't find a specific answer to your question. Here are some topics I can help with:

• What this chatbot is and how it works
• How to switch between AI and FAQ modes
• Information about API keys and OpenAI
• Customization options in AI mode
• Data security and privacy

Please try rephrasing your question or ask about one of these topics.`;
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseContent,
      timestamp: new Date()
    };

    setTimeout(() => {
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);

    setInput("");
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">FAQ Assistant</h2>
            <p className="text-gray-600 max-w-md mb-6">
              Ask me any questions about this chatbot. I can help with common questions instantly!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              {faqData.slice(0, 4).map((faq, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 text-left justify-start"
                  onClick={() => handleQuickQuestion(faq.question)}
                >
                  <div className="text-sm">{faq.question}</div>
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this chatbot..."
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </>
  );
}
