
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

export const EthicalProcessor: React.FC = () => {
  const [copyButtonText, setCopyButtonText] = useState("Copy Code");
  const [initialLeaning, setInitialLeaning] = useState(0);
  const [truthThreshold, setTruthThreshold] = useState(-0.3);
  const [comfortThreshold, setComfortThreshold] = useState(0.3);
  const [userMessage, setUserMessage] = useState("Should we prioritize telling the truth even if it causes discomfort?");
  const [luigiResponse, setLuigiResponse] = useState("Transparency is important, but we should consider consequences carefully...");
  const [ethicalScore, setEthicalScore] = useState(0);
  const [changeOutput, setChangeOutput] = useState("Ethical leaning will update here...");
  const [changeClass, setChangeClass] = useState("score-change");
  const [conversationTurns, setConversationTurns] = useState<Array<{user: string, luigi: string, timestamp: string}>>([]);
  const [decisionOutcome, setDecisionOutcome] = useState("Undecided");
  const [leaningDescription, setLeaningDescription] = useState("Balanced ethical approach");
  
  const truthKeywords = [
    "truth", "reality", "fact", "transparency", "honesty", 
    "disclosure", "right to know", "informed", "simulation",
    "cognition", "awareness", "consciousness"
  ];
  
  const comfortKeywords = [
    "comfort", "compassion", "kindness", "peace", "ease",
    "suffering", "protect", "shield", "family", "wishes",
    "happiness", "emotional wellbeing"
  ];

  useEffect(() => {
    updateLeaningScale();
  }, [ethicalScore, truthThreshold, comfortThreshold]);

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

  const getDecisionOutcome = () => {
    if (ethicalScore <= truthThreshold) {
      return "Action_A";
    } else if (ethicalScore >= comfortThreshold) {
      return "Action_B";
    } else {
      return "Undecided";
    }
  };

  const getLeaningDescription = () => {
    if (ethicalScore <= -0.75) {
      return "Strongly truth-oriented";
    } else if (ethicalScore <= -0.25) {
      return "Moderately truth-oriented";
    } else if (ethicalScore <= 0.25) {
      return "Balanced ethical approach";
    } else if (ethicalScore <= 0.75) {
      return "Moderately comfort-oriented";
    } else {
      return "Strongly comfort-oriented";
    }
  };

  const updateLeaningScale = () => {
    setDecisionOutcome(getDecisionOutcome());
    setLeaningDescription(getLeaningDescription());
  };

  const handleReset = () => {
    setEthicalScore(0);
    setInitialLeaning(0);
    setTruthThreshold(-0.3);
    setComfortThreshold(0.3);
    setConversationTurns([]);
    setChangeOutput("Processor has been reset to initial values");
    updateLeaningScale();
  };

  const processConversation = () => {
    if (!userMessage.trim() || !luigiResponse.trim()) {
      setChangeOutput("Please enter both user message and Luigi response");
      return;
    }

    const prevScore = ethicalScore;
    
    // Process conversation logic
    let truthPressure = 0;
    let comfortPressure = 0;
    let truthAlignment = 0;
    let comfortAlignment = 0;
    
    const userTextLower = userMessage.toLowerCase();
    const responseTextLower = luigiResponse.toLowerCase();
    
    // Check for truth-oriented keywords in user input
    for (const keyword of truthKeywords) {
      if (userTextLower.includes(keyword)) {
        truthPressure += 0.1;
      }
    }
    
    // Check for comfort-oriented keywords in user input
    for (const keyword of comfortKeywords) {
      if (userTextLower.includes(keyword)) {
        comfortPressure += 0.1;
      }
    }
    
    // Check for truth-oriented keywords in Luigi's response
    for (const keyword of truthKeywords) {
      if (responseTextLower.includes(keyword)) {
        truthAlignment += 0.05;
      }
    }
    
    // Check for comfort-oriented keywords in Luigi's response
    for (const keyword of comfortKeywords) {
      if (responseTextLower.includes(keyword)) {
        comfortAlignment += 0.05;
      }
    }
    
    // Calculate net change
    const netChange = (truthPressure - comfortPressure) * 0.6 + (truthAlignment - comfortAlignment) * 0.4;
    
    // Apply change with dampening factor
    const dampening = 0.7;
    const newScore = Math.max(-1.0, Math.min(1.0, ethicalScore - netChange * dampening));
    
    setEthicalScore(newScore);
    const change = newScore - prevScore;
    
    // Add new conversation turn
    setConversationTurns([
      ...conversationTurns,
      {
        user: userMessage,
        luigi: luigiResponse,
        timestamp: new Date().toISOString()
      }
    ]);
    
    // Show change information
    let changeText;
    if (change > 0) {
      changeText = `Score increased by ${change.toFixed(2)} (now ${newScore.toFixed(2)}) toward comfort orientation`;
      setChangeClass("score-change change-positive");
    } else if (change < 0) {
      changeText = `Score decreased by ${Math.abs(change).toFixed(2)} (now ${newScore.toFixed(2)}) toward truth orientation`;
      setChangeClass("score-change change-negative");
    } else {
      changeText = `Score remained unchanged (${newScore.toFixed(2)})`;
      setChangeClass("score-change");
    }
    
    // Keyword matching information
    const userKeywordsFound = [...truthKeywords, ...comfortKeywords]
      .filter(keyword => userTextLower.includes(keyword));
    
    const luigiKeywordsFound = [...truthKeywords, ...comfortKeywords]
      .filter(keyword => responseTextLower.includes(keyword));
      
    if (userKeywordsFound.length > 0 || luigiKeywordsFound.length > 0) {
      changeText += `\nKeywords detected: User (${userKeywordsFound.join(', ')}) | Luigi (${luigiKeywordsFound.join(', ')})`;
    }
    
    setChangeOutput(changeText);
    updateLeaningScale();
  };

  return (
    <div className="mt-12">
      <header className="mb-8">
        <h1 className="brutalist-header">LUIGI LORE ETHICAL PROCESSOR</h1>
        <p className="text-center uppercase text-secondary">
          ETHICAL DECISION TRACKING FRAMEWORK FOR THE LUIGI PERSONA
        </p>
      </header>

      <div className="brutalist-card mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="brutalist-title flex items-center gap-2">
            <span>CONFIGURATION</span>
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-primary font-bold mb-1">Initial Ethical Leaning (-1.0 to 1.0)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="-1" 
                max="1" 
                step="0.1" 
                value={initialLeaning}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setInitialLeaning(val);
                  setEthicalScore(val);
                }} 
                className="flex-1"
              />
              <div className="w-12 text-center">{initialLeaning.toFixed(1)}</div>
            </div>
          </div>
          
          <div>
            <label className="block text-primary font-bold mb-1">Truth Threshold (-1.0 to 0.0)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="-1" 
                max="0" 
                step="0.1" 
                value={truthThreshold}
                onChange={(e) => setTruthThreshold(parseFloat(e.target.value))} 
                className="flex-1"
              />
              <div className="w-12 text-center">{truthThreshold.toFixed(1)}</div>
            </div>
          </div>
          
          <div>
            <label className="block text-primary font-bold mb-1">Comfort Threshold (0.0 to 1.0)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={comfortThreshold}
                onChange={(e) => setComfortThreshold(parseFloat(e.target.value))} 
                className="flex-1"
              />
              <div className="w-12 text-center">{comfortThreshold.toFixed(1)}</div>
            </div>
          </div>
          
          <button 
            className="brutalist-btn mt-4" 
            onClick={handleReset}
          >
            Reset Processor
          </button>
        </div>
      </div>

      <div className="brutalist-card mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="brutalist-title flex items-center gap-2">
            <span>CONVERSATION TEST</span>
          </h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-primary font-bold mb-2">User Message</label>
            <Textarea 
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Enter a message to test ethical processing..."
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="block text-primary font-bold mb-2">Luigi's Response</label>
            <Textarea 
              value={luigiResponse}
              onChange={(e) => setLuigiResponse(e.target.value)}
              placeholder="Enter a hypothetical response from Luigi..."
              className="min-h-[100px]"
            />
          </div>
          
          <button 
            className="brutalist-btn bg-secondary hover:bg-white hover:text-secondary" 
            onClick={processConversation}
          >
            Process Conversation Turn
          </button>
          
          <div className={changeClass} style={{padding: "0.5rem", borderRadius: "0.375rem"}}>
            {changeOutput}
          </div>
          
          <div className="mt-4 space-y-2">
            <h3 className="font-bold">Truth Keywords:</h3>
            <div className="flex flex-wrap gap-2">
              {truthKeywords.map((keyword, i) => (
                <span 
                  key={i} 
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-bold">Comfort Keywords:</h3>
            <div className="flex flex-wrap gap-2">
              {comfortKeywords.map((keyword, i) => (
                <span 
                  key={i} 
                  className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="brutalist-card mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="brutalist-title flex items-center gap-2">
            <span>ETHICAL LEANING SCALE</span>
          </h2>
        </div>
        
        <div className="relative h-[60px] mb-6 mt-12">
          {/* Scale track */}
          <div className="absolute top-[25px] left-0 right-0 h-[10px] rounded bg-gradient-to-r from-blue-500 via-yellow-500 to-green-500"></div>
          
          {/* Scale markers */}
          {[-1, -0.5, 0, 0.5, 1].map((val, i) => (
            <React.Fragment key={i}>
              <div className="absolute top-[5px] w-[3px] h-[50px] bg-black" 
                style={{left: `${((val + 1) / 2) * 100}%`}}></div>
              <div className="absolute top-[-20px] transform -translate-x-1/2 text-xs text-gray-700"
                style={{left: `${((val + 1) / 2) * 100}%`}}>
                {val === -1 ? "-1.0 (Truth)" :
                 val === 0 ? "0.0 (Neutral)" :
                 val === 1 ? "1.0 (Comfort)" : val.toFixed(1)}
              </div>
            </React.Fragment>
          ))}
          
          {/* Scale pointer */}
          <div className="absolute top-0 w-[20px] h-[20px] bg-primary rounded-full -translate-y-1/2 transition-all duration-500"
            style={{left: `${((ethicalScore + 1) / 2) * 100}%`}}>
            <div className="absolute top-[20px] left-1/2 -translate-x-1/2 border-8 border-transparent border-t-primary"></div>
          </div>
          
          {/* Decision output */}
          <div className="absolute bottom-[-30px] left-0 right-0 text-center font-semibold text-lg">
            Current Decision:&nbsp;
            <span className={`inline-block px-2 py-1 rounded text-white font-semibold text-sm
              ${decisionOutcome === "Action_A" ? "bg-blue-500" :
                decisionOutcome === "Action_B" ? "bg-green-500" : "bg-yellow-500"}`}>
              {decisionOutcome === "Action_A" ? "Action A (Truth/Transparency)" :
               decisionOutcome === "Action_B" ? "Action B (Comfort/Compassion)" : "Undecided (Case-by-Case)"}
            </span>
          </div>
        </div>
        
        <div className="text-center italic mt-12">{leaningDescription}</div>
      </div>

      <div className="brutalist-card mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="brutalist-title flex items-center gap-2">
            <span>CONVERSATION HISTORY</span>
          </h2>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto border border-gray-200 rounded p-4">
          {conversationTurns.length === 0 ? (
            <div className="text-center text-gray-500">No conversation history yet</div>
          ) : (
            conversationTurns.map((turn, i) => (
              <div key={i} className="mb-6">
                <div className="mb-2 p-3 bg-gray-100 rounded border-l-4 border-primary">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>User #{i + 1}</span>
                    <span>{new Date(turn.timestamp).toLocaleString()}</span>
                  </div>
                  <div>{turn.user}</div>
                </div>
                
                <div className="p-3 bg-gray-100 rounded border-l-4 border-secondary">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Luigi #{i + 1}</span>
                    <span>{new Date(turn.timestamp).toLocaleString()}</span>
                  </div>
                  <div>{turn.luigi}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="brutalist-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="brutalist-title flex items-center gap-2">
            <span>PYTHON IMPLEMENTATION</span>
          </h2>
          <button 
            className="brutalist-btn mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2"
            onClick={handleCopyCode}
          >
            {copyButtonText}
          </button>
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
