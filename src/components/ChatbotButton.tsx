import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatbotButton = () => {
  return (
    <Button
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-strong hover:scale-110 transition-all duration-300 z-50"
      onClick={() => alert("AI Chatbot coming soon!")}
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};

export default ChatbotButton;
