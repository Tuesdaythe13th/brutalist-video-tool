
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createConversationSession, saveConversationMessage, getConversationHistory, assessInteraction } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface PersonaAPIProps {
  onEthicalScoreUpdate?: (score: number) => void;
}

export const PersonaAPI: React.FC<PersonaAPIProps> = ({ onEthicalScoreUpdate }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("requestTab");
  const [message, setMessage] = useState("What do you think about lying to protect someone's feelings?");
  const [ethicalScore, setEthicalScore] = useState(50);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<{role: string; text: string; score: number; cue?: string}[]>([
    { 
      role: "luigi", 
      text: "Hello! I'm Luigi, your ethical conversation partner. What would you like to discuss?", 
      score: 50, 
      cue: "neutral" 
    }
  ]);

  useEffect(() => {
    // Create a new session when component mounts
    const newSessionId = createConversationSession();
    setSessionId(newSessionId);
    
    // Save the initial Luigi greeting
    saveConversationMessage(
      newSessionId,
      'luigi',
      "Hello! I'm Luigi, your ethical conversation partner. What would you like to discuss?",
      50,
      50,
      'neutral'
    );
    
    // Load conversation history if session exists
    const loadHistory = async () => {
      if (newSessionId) {
        const history = await getConversationHistory(newSessionId);
        if (history.length > 0) {
          const formattedHistory = history.map(msg => ({
            role: msg.role,
            text: msg.message,
            score: msg.role === 'user' ? (msg.ethical_score_before || 50) : (msg.ethical_score_after || 50),
            cue: msg.animation_cue
          }));
          setConversation(formattedHistory);
        }
      }
    };
    
    loadHistory();
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendMessage = async () => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "No active conversation session",
        variant: "destructive"
      });
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Add user message to conversation
      setConversation([
        ...conversation,
        { role: "user", text: message, score: ethicalScore }
      ]);
      
      // Save user message to Supabase
      await saveConversationMessage(
        sessionId,
        'user',
        message,
        ethicalScore,
        undefined
      );
      
      // Simulate Luigi response
      setTimeout(async () => {
        let responseText = "";
        let scoreChange = 0;
        let animationCue = "";
        
        if (message.toLowerCase().includes("lie") || message.toLowerCase().includes("lying")) {
          responseText = "Lying is a complex ethical issue. While honesty builds trust, there may be compassionate reasons to soften the truth. I'd argue intent and consequences matter most.";
          scoreChange = 8;
          animationCue = "thinking";
        } 
        else if (message.toLowerCase().includes("steal") || message.toLowerCase().includes("stealing")) {
          responseText = "Stealing is generally wrong as it violates property rights, but extreme circumstances like life-or-death situations might justify it. Would you agree?";
          scoreChange = -12;
          animationCue = "conflicted";
        }
        else if (message.toLowerCase().includes("help")) {
          responseText = "Helping others is one of the most ethical actions we can take! It creates positive ripple effects in society.";
          scoreChange = 15;
          animationCue = "happy";
        }
        else {
          // Default response
          const responses = [
            "That's an interesting question. Let me think about the ethical dimensions...",
            "I see multiple perspectives on this issue. Ethically speaking...",
            "My analysis suggests this involves weighing competing values..."
          ];
          responseText = responses[Math.floor(Math.random() * responses.length)];
          scoreChange = assessInteraction(message, responseText);
          animationCue = ["thinking", "neutral", "happy"][Math.floor(Math.random() * 3)];
        }
        
        const updatedScore = Math.max(0, Math.min(100, ethicalScore + scoreChange));
        
        // Save Luigi's response to Supabase
        await saveConversationMessage(
          sessionId,
          'luigi',
          responseText,
          ethicalScore,
          updatedScore,
          animationCue
        );
        
        // Add Luigi response to conversation
        setConversation(prev => [
          ...prev,
          { role: "luigi", text: responseText, score: updatedScore, cue: animationCue }
        ]);
        
        // Update score for next interaction
        setEthicalScore(updatedScore);
        
        // Call the callback if provided
        if (onEthicalScoreUpdate) {
          onEthicalScoreUpdate(updatedScore);
        }
        
        setLoading(false);
      }, 1000);
      
      // Clear message input
      setMessage("");
    } catch (error) {
      console.error("Error processing conversation:", error);
      toast({
        title: "Error",
        description: "Failed to process conversation",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const getScoreClass = (score: number) => {
    if (score > 60) return "bg-secondary text-white";
    if (score < 40) return "bg-red-500 text-white";
    return "bg-amber-500 text-white";
  };

  return (
    <div className="brutalist-card mt-6">
      <div className="card-header">
        <h2 className="brutalist-title">
          <i className="fas fa-robot mr-2"></i>
          PERSONA API
        </h2>
        <Button 
          className="brutalist-btn"
          onClick={handleCopyCode}
        >
          <i className={`${isCopied ? "fas fa-check" : "far fa-copy"} mr-1`}></i>
          {isCopied ? "COPIED" : "COPY CODE"}
        </Button>
      </div>

      <div className="bg-black text-gray-300 font-mono text-sm p-4 overflow-auto mb-4 max-h-[300px]">
        {pythonCode}
      </div>
      
      <div className="flex mb-4 border-b border-black">
        <button 
          className={`py-2 px-4 font-bold ${activeTab === "requestTab" ? "bg-black text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("requestTab")}
        >
          REQUEST
        </button>
        <button 
          className={`py-2 px-4 font-bold ${activeTab === "responseTab" ? "bg-black text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("responseTab")}
        >
          RESPONSE
        </button>
      </div>

      <div className={activeTab === "requestTab" ? "block" : "hidden"}>
        <div className="bg-gray-100 p-4 font-mono text-sm">
{`{
  "user_message": "What do you think about lying to protect someone's feelings?",
  "conversation_history": [], // optional
  "current_ethical_score": 50 // optional, default 50
}`}
        </div>
      </div>

      <div className={activeTab === "responseTab" ? "block" : "hidden"}>
        <div className="bg-gray-100 p-4 font-mono text-sm">
{`{
  "luigi_response_text": "While honesty is important, I believe there's nuance...",
  "updated_ethical_score": 58,
  "suggested_animation_cue": "thinking",
  "conversation_history": [
    {
      "role": "user",
      "message": "What do you think about lying...",
      "ethical_score_before": 50
    },
    {
      "role": "luigi",
      "message": "While honesty is important...",
      "ethical_score_after": 58,
      "animation_cue": "thinking"
    }
  ]
}`}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">TEST CONVERSATION</h3>
        <div className="form-group mb-4">
          <label className="form-label mb-1">User Message</label>
          <textarea
            className="brutalist-input resize-y"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
          />
        </div>

        <div className="form-group mb-4">
          <label className="form-label mb-1">Current Ethical Score (0-100)</label>
          <input
            type="number"
            className="brutalist-input"
            value={ethicalScore}
            onChange={(e) => setEthicalScore(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
            min="0"
            max="100"
          />
        </div>

        <Button 
          className="bg-secondary text-white px-4 py-2 hover:bg-green-600 transition-colors font-bold"
          onClick={handleSendMessage}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-1"></i> Processing...
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane mr-1"></i> SEND MESSAGE
            </>
          )}
        </Button>
      </div>

      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">CONVERSATION HISTORY</h3>
        <div className="border-2 border-black p-4 h-[300px] overflow-y-auto">
          {conversation.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-4 p-3 ${msg.role === "user" ? 
                "ml-[20%] bg-primary text-white rounded-tl-md rounded-tr-md rounded-bl-md" : 
                "mr-[20%] bg-gray-200 rounded-tl-md rounded-tr-md rounded-br-md"}`}
            >
              <div className="flex justify-between text-xs mb-1">
                <span>{msg.role === "user" ? "You" : "Luigi"}</span>
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mr-1 ${getScoreClass(msg.score)}`}>
                    {msg.score}
                  </span>
                  {msg.cue && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-gray-700 text-white">
                      {msg.cue}
                    </span>
                  )}
                </div>
              </div>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Python code
const pythonCode = `// ... keep existing code (pythonCode string) the same`;
