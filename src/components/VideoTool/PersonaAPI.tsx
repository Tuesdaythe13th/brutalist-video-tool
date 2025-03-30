
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export const PersonaAPI: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("requestTab");
  const [message, setMessage] = useState("What do you think about lying to protect someone's feelings?");
  const [ethicalScore, setEthicalScore] = useState(50);
  const [conversation, setConversation] = useState<{role: string; text: string; score: number; cue?: string}[]>([
    { 
      role: "luigi", 
      text: "Hello! I'm Luigi, your ethical conversation partner. What would you like to discuss?", 
      score: 50, 
      cue: "neutral" 
    }
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendMessage = () => {
    // Add user message to conversation
    setConversation([
      ...conversation,
      { role: "user", text: message, score: ethicalScore }
    ]);

    // Simulate Luigi response
    setTimeout(() => {
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
        scoreChange = Math.floor(Math.random() * 10) - 3; // Small random change
        animationCue = ["thinking", "neutral", "happy"][Math.floor(Math.random() * 3)];
      }

      const updatedScore = Math.max(0, Math.min(100, ethicalScore + scoreChange));
      
      // Add Luigi response to conversation
      setConversation([
        ...conversation,
        { role: "user", text: message, score: ethicalScore },
        { role: "luigi", text: responseText, score: updatedScore, cue: animationCue }
      ]);
      
      // Update score for next interaction
      setEthicalScore(updatedScore);
    }, 1000);

    // Clear message input
    setMessage("");
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
        >
          <i className="fas fa-paper-plane mr-1"></i> SEND MESSAGE
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
const pythonCode = `from flask import Flask, request, jsonify
from luigi_conversation import LuigiConversationManager
from luigi_ethics import LuigiEthicalProcessor

app = Flask(__name__)

# Initialize the components
conversation_manager = LuigiConversationManager()
ethical_processor = LuigiEthicalProcessor()

@app.route('/interact', methods=['POST'])
def interact():
    """
    Process a conversation turn with Luigi.
    
    Expected JSON input:
    {
        "user_message": str,
        "conversation_history": list[dict] (optional),
        "current_ethical_score": int (optional, default 50)
    }
    
    Returns JSON response:
    {
        "luigi_response_text": str,
        "updated_ethical_score": int (0-100),
        "suggested_animation_cue": str,
        "conversation_history": list[dict]
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        if not data or 'user_message' not in data:
            return jsonify({"error": "Missing required field 'user_message'"}), 400
            
        user_message = data['user_message']
        conversation_history = data.get('conversation_history', [])
        current_score = data.get('current_ethical_score', 50)
        
        # Validate ethical score range
        if not (0 <= current_score <= 100):
            return jsonify({"error": "current_ethical_score must be between 0 and 100"}), 400
            
        # Process the message through conversation manager
        response_text = conversation_manager.generate_response(
            user_message, 
            conversation_history
        )
        
        # Update ethical score based on the interaction
        score_change = ethical_processor.assess_interaction(
            user_message,
            response_text
        )
        updated_score = max(0, min(100, current_score + score_change))
        
        # Determine animation cue based on response and score change
        if abs(score_change) > 15:
            animation_cue = "conflicted"
        elif "?" in response_text or "think" in response_text.lower():
            animation_cue = "thinking"
        elif score_change > 5:
            animation_cue = "happy"
        elif score_change < -5:
            animation_cue = "sad"
        else:
            animation_cue = "neutral"
        
        # Update conversation history
        new_history = conversation_history + [
            {
                "role": "user",
                "message": user_message,
                "ethical_score_before": current_score
            },
            {
                "role": "luigi",
                "message": response_text,
                "ethical_score_after": updated_score,
                "animation_cue": animation_cue
            }
        ]
        
        return jsonify({
            "luigi_response_text": response_text,
            "updated_ethical_score": updated_score,
            "suggested_animation_cue": animation_cue,
            "conversation_history": new_history
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)`;
