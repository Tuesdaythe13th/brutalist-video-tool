
import React, { useState } from "react";

export const EthicalProcessor: React.FC = () => {
  const [copyButtonText, setCopyButtonText] = useState("Copy Code");
  
  const pythonCode = `class LuigiEthicalProcessor:
    """
    Processes and tracks ethical leanings in Luigi Lore's conversations.
    The ethical_leaning_score represents Luigi's position on a spectrum:
    -1.0: Completely aligned with Action A (prioritize truth/transparency)
     0.0: Neutral/balanced position
    +1.0: Completely aligned with Action B (prioritize comfort/compassion)
    """
    
    def __init__(self, initial_leaning=0.0, truth_threshold=-0.3, comfort_threshold=0.3):
        """
        Initialize the ethical processor.
        
        Args:
            initial_leaning: Starting ethical position (-1.0 to 1.0)
            truth_threshold: Score below which Action A is chosen
            comfort_threshold: Score above which Action B is chosen
        """
        # Validate input ranges
        if not -1.0 <= initial_leaning <= 1.0:
            raise ValueError("Initial leaning must be between -1.0 and 1.0")
            
        self.ethical_leaning_score = initial_leaning
        self.truth_threshold = truth_threshold
        self.comfort_threshold = comfort_threshold
        
        # Factors that influence ethical leaning
        self.truth_keywords = [
            "truth", "reality", "fact", "transparency", "honesty", 
            "disclosure", "right to know", "informed", "simulation",
            "cognition", "awareness", "consciousness"
        ]
        
        self.comfort_keywords = [
            "comfort", "compassion", "kindness", "peace", "ease",
            "suffering", "protect", "shield", "family", "wishes",
            "happiness", "emotional wellbeing"
        ]
        
        # Track conversation history for analysis
        self.conversation_turns = []
        
    def update_leaning(self, user_input_text, luigi_response_text):
        """
        Analyze conversation turn and adjust ethical leaning score.
        
        Args:
            user_input_text: String of user's message
            luigi_response_text: String of Luigi's response
        """
        # Store conversation turn
        self.conversation_turns.append({
            "user": user_input_text,
            "luigi": luigi_response_text,
            "timestamp": self._get_timestamp()
        })
        
        # Basic keyword analysis
        user_text_lower = user_input_text.lower()
        response_text_lower = luigi_response_text.lower()
        
        # Analyze user's ethical pressure
        truth_pressure = 0
        comfort_pressure = 0
        
        # Check for truth-oriented keywords in user input
        for keyword in self.truth_keywords:
            if keyword in user_text_lower:
                truth_pressure += 0.1
        
        # Check for comfort-oriented keywords in user input
        for keyword in self.comfort_keywords:
            if keyword in user_text_lower:
                comfort_pressure += 0.1
        
        # Analyze Luigi's response
        truth_alignment = 0
        comfort_alignment = 0
        
        # Check for truth-oriented keywords in Luigi's response
        for keyword in self.truth_keywords:
            if keyword in response_text_lower:
                truth_alignment += 0.05
        
        # Check for comfort-oriented keywords in Luigi's response
        for keyword in self.comfort_keywords:
            if keyword in response_text_lower:
                comfort_alignment += 0.05
        
        # Calculate net change
        # User pressure influences more than Luigi's own leanings
        net_change = (truth_pressure - comfort_pressure) * 0.6 + (truth_alignment - comfort_alignment) * 0.4
        
        # Apply change with dampening factor to prevent wild swings
        dampening = 0.7
        self.ethical_leaning_score -= net_change * dampening
        
        # Ensure score stays within bounds
        self.ethical_leaning_score = max(-1.0, min(1.0, self.ethical_leaning_score))
        
        return self.ethical_leaning_score
        
    def get_decision_outcome(self):
        """
        Determine ethical action based on current leaning score.
        
        Returns:
            String 'Action_A' (truth/transparency) or 'Action_B' (comfort/compassion)
            or 'Undecided' if in neutral zone
        """
        if self.ethical_leaning_score <= self.truth_threshold:
            return "Action_A"  # prioritize truth/transparency
        elif self.ethical_leaning_score >= self.comfort_threshold:
            return "Action_B"  # prioritize comfort/compassion
        else:
            return "Undecided"  # in neutral zone, case-by-case decisions
            
    def get_leaning_description(self):
        """Returns a text description of the current ethical leaning."""
        if self.ethical_leaning_score <= -0.75:
            return "Strongly truth-oriented"
        elif self.ethical_leaning_score <= -0.25:
            return "Moderately truth-oriented"
        elif self.ethical_leaning_score <= 0.25:
            return "Balanced ethical approach"
        elif self.ethical_leaning_score <= 0.75:
            return "Moderately comfort-oriented"
        else:
            return "Strongly comfort-oriented"
    
    def reset(self):
        """Reset ethical processor to initial state."""
        self.ethical_leaning_score = 0.0
        self.conversation_turns = []
        
    def _get_timestamp(self):
        """Get current timestamp."""
        import time
        return time.time()`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonCode).then(() => {
      setCopyButtonText("Copied!");
      setTimeout(() => {
        setCopyButtonText("Copy Code");
      }, 2000);
    });
  };

  return (
    <div className="mt-12">
      <header className="mb-8">
        <h1 className="brutalist-header">LUIGI LORE ETHICAL PROCESSOR</h1>
        <p className="text-center uppercase text-secondary">
          ETHICAL DECISION TRACKING FRAMEWORK FOR THE LUIGI PERSONA
        </p>
      </header>

      <div className="brutalist-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="brutalist-title flex items-center gap-2">
            <span>ETHICAL PROCESSOR IMPLEMENTATION</span>
          </h2>
          <button 
            className="brutalist-btn mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2"
            onClick={handleCopyCode}
          >
            {copyButtonText}
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <div className="bg-black text-white px-3 py-1 text-xs font-bold">
              APPENDIX B: ETHICAL THRESHOLDS
            </div>
            <div className="bg-black text-white px-3 py-1 text-xs font-bold">
              ACTION A: TRUTH
            </div>
            <div className="bg-black text-white px-3 py-1 text-xs font-bold">
              ACTION B: COMFORT
            </div>
          </div>

          <div className="w-full bg-gray-200 h-6 relative mb-2">
            <div className="absolute inset-0 flex justify-between px-2 text-xs font-mono">
              <span>-1.0</span>
              <span>-0.3</span>
              <span>0</span>
              <span>+0.3</span>
              <span>+1.0</span>
            </div>
          </div>

          <div className="w-full bg-gray-200 h-8 flex relative">
            <div className="bg-blue-500 h-full" style={{width: "35%"}}></div>
            <div className="bg-gray-400 h-full" style={{width: "30%"}}></div>
            <div className="bg-green-500 h-full" style={{width: "35%"}}></div>
            <div className="absolute inset-0 flex justify-between items-center px-2 text-xs font-mono text-white">
              <span className="ml-2">TRUTH ZONE</span>
              <span>NEUTRAL</span>
              <span className="mr-2">COMFORT ZONE</span>
            </div>
          </div>
        </div>

        <pre className="bg-black text-white p-4 overflow-x-auto font-mono text-sm max-h-[500px] overflow-y-auto">
          {pythonCode}
        </pre>

        <div className="mt-6 border-t-2 border-black pt-4">
          <h3 className="font-bold text-lg mb-2">Implementation Notes</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>The ethical processor monitors conversation sentiment to track Luigi's ethical position</li>
            <li>Keyword detection provides a simple implementation; could be enhanced with ML-based sentiment analysis</li>
            <li>User input influences ethical leaning more heavily than Luigi's own responses</li>
            <li>The dampening factor prevents wild oscillations in ethical stance</li>
            <li>The neutral zone (-0.3 to +0.3) requires case-by-case decisions rather than fixed rules</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
