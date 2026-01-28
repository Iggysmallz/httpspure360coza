import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
}

const WhatsAppButton = ({ 
  message = "Hello Pure360, I have an enquiry.", 
  className = "" 
}: WhatsAppButtonProps) => {
  const whatsappNumber = "27764002332";

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <Button
      onClick={handleClick}
      className={`fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-green-500 p-0 shadow-lg hover:bg-green-600 md:bottom-6 ${className}`}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  );
};

export default WhatsAppButton;
