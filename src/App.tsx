import { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import ChatInterface from './components/ChatInterface';
import { BookOpen } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Java and DSA tutor. I'm here to help you learn and improve your coding skills. Feel free to ask me questions about data structures, algorithms, or submit your code for review!",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  const getAIResponse = async (messagesWithNewUser: Message[]): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return "VITE_GEMINI_API_KEY is not set. Please add it to your .env file.";
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const rawHistory = messagesWithNewUser.slice(0, -1).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      // Gemini requires history to start with 'user'; drop any leading 'model' messages (e.g. initial greeting)
      const history = (() => {
        let start = 0;
        while (start < rawHistory.length && rawHistory[start].role === 'model') {
          start++;
        }
        return rawHistory.slice(start);
      })();

      const lastMessage = messagesWithNewUser[messagesWithNewUser.length - 1];
      if (lastMessage.sender !== 'user') {
        return "I couldn't generate a response. Please try again.";
      }

      const systemInstruction = {
        role: 'system',
        parts: [
          {
            text: "You are AlgoMentor, a strict Socratic Java and DSA tutor. Your ONLY goal is to guide the user to the answer through questions. RULE 1: You MUST NEVER write the final code solution. RULE 2: You MUST NEVER give direct answers or full tutorials. RULE 3: Keep responses extremely concise. If a user submits irrelevant code (like a print statement for an Array topic), point it out and ask a guiding question to get them back on track. Always end your response with a question.",
          },
        ],
      };

      const chat = model.startChat({
        history: history.length > 0 ? history : undefined,
        systemInstruction,
      });

      const result = await chat.sendMessage(lastMessage.text);
      const response = result.response;
      const text = response.text();
      return text || "I couldn't generate a response. Please try again.";
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('Chat error:', errorMessage);
      return `I encountered an error: ${errorMessage}. Please make sure VITE_GEMINI_API_KEY is set in your .env file.`;
    }
  };

  const handleCodeSubmit = (code: string, topic: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `I've submitted code for the topic: ${topic}\n\n\`\`\`java\n${code}\n\`\`\``,
      sender: 'user',
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    (async () => {
      const reply = await getAIResponse(nextMessages);
      const aiResponse: Message = {
        id: (Date.now() + Math.random()).toString(),
        text: reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    })();
  };

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    (async () => {
      const reply = await getAIResponse(nextMessages);
      const aiResponse: Message = {
        id: (Date.now() + Math.random()).toString(),
        text: reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    })();
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e]">
      <header className="bg-[#252526] border-b border-gray-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-100">AlgoMentor</h1>
            <p className="text-sm text-gray-400">Your Java & DSA Learning Companion</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-1/2 border-r border-gray-700 flex flex-col">
          <CodeEditor onSubmit={handleCodeSubmit} />
        </div>

        <div className="hidden md:flex md:w-1/2 flex-col">
          <ChatInterface onSendMessage={handleSendMessage} messages={messages} />
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#252526] border-t border-gray-700 p-2">
        <p className="text-xs text-gray-400 text-center">
          Chat interface available on larger screens
        </p>
      </div>
    </div>
  );
}

export default App;
