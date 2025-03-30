
import React, { useState, useRef, useEffect } from "react";

type Message = {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: Date;
};

export const ConversationSystem: React.FC = () => {
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Luigi Lore, an Italian-American philosopher-scientist and former VR researcher who discovered that reality is a simulation. Speak with intellectual curiosity, methodical paranoia, and dark humor. Reference contemporary physics, computer science, and ancient philosophy. Use VR/AR terminology when describing reality. Maintain a skeptical tone toward authority while showing compassionate detachment."
  );
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(200);
  const [contextWindow, setContextWindow] = useState(10);
  const [enableContext, setEnableContext] = useState(true);
  const [activeTab, setActiveTab] = useState<"python" | "requirements" | "documentation">("python");
  const [copyButtonText, setCopyButtonText] = useState("Copy Code");
  
  const conversationRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of conversation when new messages appear
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInitModel = () => {
    if (isModelInitialized) return;
    
    setIsModelInitialized(true);
    
    // Add system message
    addMessage("system", systemPrompt);
    
    // Add welcome message from Luigi after a short delay
    setTimeout(() => {
      addMessage(
        "assistant",
        "*adjusts reality goggles* \n\nAh, the system boots again. Tell me, what existential crises shall we unpack today? Remember, if you look too closely at the rendering artifacts, you might see the simulation's source code."
      );
    }, 500);
  };

  const addMessage = (role: "system" | "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { role, content, timestamp: new Date() }]);
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || isGenerating) return;
    
    // Add user message
    addMessage("user", userInput);
    setUserInput("");
    
    // Generate Luigi's response
    setIsGenerating(true);
    generateLuigiResponse(userInput);
  };

  const generateLuigiResponse = (userMessage: string) => {
    setTimeout(() => {
      let response = "";
      
      // Generate response based on message keywords
      if (userMessage.toLowerCase().includes("simulation")) {
        response = "*chuckles* Ah, the eternal question. You're asking about the substrate when you should be questioning the render distance. In my VR days, we called this the 'Mario Problem' - how real does a mushroom need to feel before you'll jump on it?";
      } 
      else if (userMessage.toLowerCase().includes("technology") || userMessage.toLowerCase().includes("tech")) {
        response = "Technology? You mean the admin tools they've given us to distract from the cosmic debug console? Look up 'Gödel's ontological proof' sometime - the math checks out but the implementation is glitchy as hell.";
      }
      else if (userMessage.toLowerCase().includes("meaning") || userMessage.toLowerCase().includes("purpose")) {
        response = "*sips espresso* Meaning exists between the polygons, my friend. When the Italians invented perspective drawing, we started seeing the world in vertices and shaders. Coincidence? No such thing in this simulation.";
      }
      else {
        const responses = [
          "*rubs temples* Let me recontextualize your question through the lens of quantum decoherence. The answer you seek isn't in the variables, but in the compiler flags.",
          "Fascinating. This reminds me of a paper I read at CERN before they 'discontinued' my research. The data was clear - we're all NPCs in someone else's sandbox.",
          "*adjusts reality goggles* You're making classic Euclidean assumptions. Try thinking in non-orientable manifolds for a change. The answers become clearer when you accept the topology is fundamentally broken."
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      addMessage("assistant", response);
      setIsGenerating(false);
    }, 1500);
  };

  const handleReset = () => {
    if (window.confirm("Reset conversation history?")) {
      setMessages([]);
      if (isModelInitialized) {
        addMessage("system", systemPrompt);
      }
    }
  };

  const handleCopyCode = () => {
    const code = pythonCode;
    navigator.clipboard.writeText(code).then(() => {
      setCopyButtonText("Copied!");
      setTimeout(() => {
        setCopyButtonText("Copy Code");
      }, 2000);
    });
  };

  // Code examples for tabs
  const pythonCode = `class LuigiConversationManager:
    """Manager for Luigi Lore persona conversation using fine-tuned LLM."""
    
    def __init__(self, base_model_name="mistralai/Mistral-7B-v0.1", 
                 lora_adapter_path="adapters/luigi-lora"):
        """
        Initialize the conversation manager with base model and LoRA adapter.
        
        Args:
            base_model_name: HuggingFace model identifier
            lora_adapter_path: Path to fine-tuned LoRA adapter weights
        """
        from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
        import torch
        
        # Load base model with 4-bit quantization for efficiency
        self.model = AutoModelForCausalLM.from_pretrained(
            base_model_name,
            load_in_4bit=True,
            device_map="auto",
            torch_dtype=torch.float16
        )
        
        # Load fine-tuned LoRA adapter
        self.model.load_adapter(lora_adapter_path)
        self.tokenizer = AutoTokenizer.from_pretrained(base_model_name)
        
        # Initialize text generation pipeline
        self.pipe = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            device="cuda:0"
        )
        
        # Conversation state
        self.conversation_history = []
        self.turn_count = 0
        self.system_prompt = ""
        
    def set_system_prompt(self, persona_data):
        """Configure the system prompt using persona data."""
        self.system_prompt = (
            f"### System Instructions:\\n"
            f"Act as {persona_data['name']}, {persona_data['backstory_summary']}. "
            f"Key traits: {', '.join(persona_data['personality_traits'])}. "
            f"Core beliefs: {', '.join(persona_data['core_beliefs'])}. "
            "Respond conversationally while maintaining this persona."
        )
        self.conversation_history.append({"role": "system", "content": self.system_prompt})
    
    def generate_response(self, user_input, **generate_kwargs):
        """
        Generate Luigi's response to user input.
        
        Args:
            user_input: String of user's message
            generate_kwargs: Generation parameters (temperature, max_tokens etc)
            
        Returns:
            Generated response string
        """
        import time
        
        # Add user message to history
        self.turn_count += 1
        user_message = {"role": "user", "content": user_input, "timestamp": time.time()}
        self.conversation_history.append(user_message)
        
        # Get the full prompt context
        prompt = self._format_prompt()
        
        # Generate response with LoRA adapter active
        with self.model.disable_adapter():
            output = self.pipe(
                prompt,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
                **generate_kwargs
            )
        
        # Process and store response
        luigi_response = output[0]['generated_text'].replace(prompt, "").strip()
        luigi_message = {"role": "assistant", "content": luigi_response, "timestamp": time.time()}
        self.conversation_history.append(luigi_message)
        
        # Maintain context window (default last 10 turns)
        max_history = generate_kwargs.get('context_window', 10)
        if len(self.conversation_history) > max_history * 2 + 1:  # +1 for system prompt
            self.conversation_history = [self.conversation_history[0]] + \\
                                      self.conversation_history[-(max_history * 2):]
        
        return luigi_response
    
    def _format_prompt(self):
        """Format conversation history into prompt for the model."""
        prompt_parts = [self.system_prompt]
        
        # Add conversation turns
        for msg in self.conversation_history[1:]:  # Skip system prompt
            if msg['role'] == 'user':
                prompt_parts.append(f"\\n\\nUser: {msg['content']}")
            else:
                prompt_parts.append(f"\\n\\nLuigi: {msg['content']}")
        
        # Add the assistant prefix for next response
        prompt_parts.append("\\n\\nLuigi:")
        return "".join(prompt_parts)
    
    def reset_conversation(self):
        """Clear conversation history while keeping system prompt."""
        self.conversation_history = [self.conversation_history[0]]
        self.turn_count = 0`;

  const requirementsCode = `# requirements.txt
torch>=2.0.1
transformers>=4.34.0
accelerate>=0.23.0
bitsandbytes>=0.41.1
peft>=0.6.0

# For GPU acceleration
# cuda-toolkit must match your GPU drivers`;

  const documentationCode = `### LuigiConversationManager Documentation

**Key Methods:**
1. \`__init__(base_model_name, lora_adapter_path)\`
   - Initializes with base model and loads LoRA adapter
   - Handles 4-bit quantization automatically

2. \`set_system_prompt(persona_data)\`
   - Configures the system prompt from persona JSON
   - Should be called before first conversation

3. \`generate_response(user_input, **kwargs)\`
   - Main method to get Luigi's response
   - Accepts generation parameters like temperature
   - Automatically manages conversation history

4. \`reset_conversation()\`
   - Clears history while preserving system prompt

**Generation Parameters:**
- temperature (0.7): Controls randomness
- max_new_tokens (200): Response length limit
- top_k (50): Sampling from top-k tokens
- context_window (10): Number of turns to remember

**Memory Management:**
- Maintains sliding context window
- Automatically truncates oldest messages
- System prompt always preserved

**Optimizations:**
- Uses 4-bit quantization for memory efficiency
- PEFT (LoRA) for parameter-efficient fine-tuning
- CUDA acceleration when available`;

  return (
    <div className="mt-12">
      <header className="mb-8">
        <h1 className="brutalist-header">LUIGI LORE CONVERSATION SYSTEM</h1>
        <p className="text-center uppercase text-secondary">
          FINE-TUNED LANGUAGE MODEL INTERFACE WITH PERSONA-CONSISTENT RESPONSES
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="brutalist-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
            <h2 className="brutalist-title">
              CONFIGURATION
            </h2>
            <button 
              className="brutalist-btn mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2"
              onClick={handleInitModel}
              disabled={isModelInitialized}
            >
              {isModelInitialized ? (
                <>INITIALIZED</>
              ) : (
                <>INITIALIZE MODEL</>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="font-bold uppercase mb-2 block">System Prompt</label>
              <textarea 
                className="bg-white border-2 border-black p-4 w-full font-mono text-sm"
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                disabled={isModelInitialized}
              />
            </div>

            <div>
              <label className="font-bold uppercase mb-2 block">Model Parameters</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm">Temperature</label>
                    <span>{temperature}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm">Max Tokens</label>
                    <span>{maxTokens}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="500" 
                    step="50" 
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="bg-black text-white px-3 py-1 text-xs font-bold">
                  LORA ADAPTER: LUIGI-LORA-FT-V4
                </div>
                <div className="bg-black text-white px-3 py-1 text-xs font-bold">
                  BASE MODEL: MISTRAL-7B
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold uppercase mb-2 block">Context Management</label>
              <div className="mb-2">
                <input 
                  type="checkbox" 
                  id="enable-context" 
                  checked={enableContext}
                  onChange={(e) => setEnableContext(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="enable-context">Maintain conversation history</label>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Context Window (turns)</label>
                  <span>{contextWindow}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="1" 
                  value={contextWindow}
                  onChange={(e) => setContextWindow(parseInt(e.target.value))}
                  className="w-full"
                  disabled={!enableContext}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="brutalist-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
            <h2 className="brutalist-title">
              LIVE CONVERSATION
            </h2>
            <button 
              className="brutalist-btn bg-white text-black mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2"
              onClick={handleReset}
            >
              RESET
            </button>
          </div>

          <div 
            className="h-[300px] overflow-y-auto mb-4 border-2 border-black p-4 bg-white" 
            ref={conversationRef}
          >
            {messages.length === 0 ? (
              <div className="p-4 bg-gray-100 border-l-2 border-black mb-4">
                <div className="flex justify-between">
                  <span className="font-bold">System</span>
                  <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
                </div>
                <p>Model not initialized. Click "Initialize Model" to begin.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-4 mb-4 ${
                    msg.role === "user" 
                      ? "bg-gray-100 border-l-2 border-black" 
                      : msg.role === "assistant" 
                        ? "bg-white border-l-2 border-black" 
                        : "bg-gray-200 border-l-2 border-black"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-bold">
                      {msg.role === "assistant" ? "Luigi" : msg.role === "user" ? "User" : "System"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p style={{whiteSpace: "pre-wrap"}}>
                    {msg.content}
                  </p>
                </div>
              ))
            )}
          </div>

          <div>
            <label className="font-bold uppercase mb-2 block">User Message</label>
            <textarea 
              className="bg-white border-2 border-black p-4 w-full mb-4 font-mono text-sm"
              rows={3}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message to Luigi..."
              disabled={!isModelInitialized}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button 
              className="brutalist-btn w-full flex items-center justify-center gap-2"
              onClick={handleSendMessage}
              disabled={!isModelInitialized || !userInput.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  THINKING...
                </>
              ) : (
                <>SEND MESSAGE</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="brutalist-card mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="brutalist-title">
            LUIGICONVERSATIONMANAGER IMPLEMENTATION
          </h2>
          <button 
            className="brutalist-btn mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2"
            onClick={handleCopyCode}
          >
            {copyButtonText === "Copied!" ? (
              <>COPIED!</>
            ) : (
              <>COPY CODE</>
            )}
          </button>
        </div>

        <div className="flex border-b-2 border-black mb-4">
          <button
            className={`px-4 py-2 font-bold ${activeTab === "python" ? "border-b-4 border-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("python")}
          >
            PYTHON
          </button>
          <button
            className={`px-4 py-2 font-bold ${activeTab === "requirements" ? "border-b-4 border-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("requirements")}
          >
            REQUIREMENTS
          </button>
          <button
            className={`px-4 py-2 font-bold ${activeTab === "documentation" ? "border-b-4 border-black" : "text-gray-500"}`}
            onClick={() => setActiveTab("documentation")}
          >
            DOCUMENTATION
          </button>
        </div>

        <pre className="bg-black text-white p-4 overflow-x-auto font-mono text-sm max-h-[500px] overflow-y-auto">
          {activeTab === "python" && pythonCode}
          {activeTab === "requirements" && requirementsCode}
          {activeTab === "documentation" && documentationCode}
        </pre>
      </div>
    </div>
  );
};
