import { useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const Chatbot = ({  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const location = useLocation();

  // Show chatbot only if role is 'user'
//   if (role !== "user") return null;

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: "You", text: input };
    setConversation([...conversation, userMessage]);
    
    try {
      const response = await fetch("http://localhost:4000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input })
      });
      
      const data = await response.json();
      const botMessage = { sender: "Bot", events: data };
      setConversation((prev) => [...prev, botMessage]);
      setInput("");
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="p-4 rounded-full shadow-lg bg-blue-600 text-white">
          Chat
        </Button>
      )}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-[60vw] h-[80vh] bg-white shadow-lg border border-gray-300 rounded-lg flex flex-col">
          <div className="flex justify-between items-center bg-blue-600 text-white p-3">
            <span>Chatbot</span>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto border-b border-gray-300">
            {conversation.map((msg, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg shadow-md">
                {msg.sender === "You" ? (
                  <div className="bg-blue-100 p-2 rounded">
                    <strong>{msg.sender}:</strong> {msg.text}
                  </div>
                ) : (
                  <div>
                    <strong>{msg.sender}:</strong>
                    {msg.events.length > 0 ? (
                      msg.events.map((event) => (
                        <div key={event.id} className="mt-2 p-4 border rounded-lg shadow-md">
                          <img src={event.image} alt={event.title} className="w-full h-40 object-cover rounded" />
                          <h3 className="text-lg font-bold mt-2">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.date} - {event.location}</p>
                          <p className="text-sm mt-1">{event.description}</p>
                          <p className="text-sm font-semibold">Rating: {event.rating} ⭐</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No events found.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-3 flex border-t border-gray-300">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-l-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search events..."
            />
            <Button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-r-lg">Search</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
