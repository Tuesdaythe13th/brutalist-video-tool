
import React, { useState, useEffect } from "react";
import { useConversation } from "@11labs/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ElevenLabsWidgetProps {
  ethicalScore: number;
  weatherState: string;
}

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ 
  ethicalScore, 
  weatherState 
}) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [agentId] = useState<string>("5xmHawj3HdrruGcviH3Y"); // Luigi Lore agent ID
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [dynamicVariables, setDynamicVariables] = useState<Record<string, string>>({});

  // Check for stored API key on component mount
  useEffect(() => {
    const storedKey = window.localStorage.getItem("elevenlabs_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      setShowApiKeyInput(false);
    }
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      setIsConnected(true);
      toast({
        title: "Connected to ElevenLabs",
        description: "Luigi Lore is now ready to chat!",
      });
    },
    onDisconnect: () => {
      setIsConnected(false);
      toast({
        title: "Disconnected from ElevenLabs",
        description: "Luigi Lore has left the conversation.",
        variant: "destructive",
      });
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      toast({
        title: "ElevenLabs Error",
        description: "There was an error connecting to ElevenLabs. Please check your API key.",
        variant: "destructive",
      });
      // If there's an error with the API key, show the input again
      setShowApiKeyInput(true);
    },
    clientTools: {
      updateEthicalScore: (parameters: { score: number }) => {
        toast({
          title: "Ethical Score Updated",
          description: `New ethical score: ${parameters.score}`,
        });
        return "Score updated";
      },
      logConversation: (parameters: { message: string, role: string }) => {
        console.log(`Logged ${parameters.role} message:`, parameters.message);
        return "Conversation logged";
      },
    }
  });

  useEffect(() => {
    // Update dynamic variables when props change
    setDynamicVariables({
      current_ethical_score: ethicalScore.toString(),
      current_weather_state: weatherState,
    });

    // If connected, update the dynamic variables in the conversation
    if (isConnected && conversation) {
      try {
        // This is a method provided by the useConversation hook
        conversation.updateDynamicVariables(dynamicVariables);
      } catch (error) {
        console.error("Failed to update dynamic variables:", error);
      }
    }
  }, [ethicalScore, weatherState, isConnected, conversation]);

  const startConversation = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key",
        variant: "destructive",
      });
      return;
    }

    try {
      // Initialize ElevenLabs API with the API key
      window.localStorage.setItem("elevenlabs_api_key", apiKey);
      
      // Set API key in the header for ElevenLabs requests
      // Note: The @11labs/react library handles this internally when we provide
      // the API key to localStorage with the specific key "elevenlabs_api_key"
      
      // Start conversation with the agent
      await conversation.startSession({ 
        agentId,
        dynamicVariables
      });
      
      setShowApiKeyInput(false);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to ElevenLabs. Please check your API key.",
        variant: "destructive",
      });
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setShowApiKeyInput(true);
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
  };

  return (
    <div className="brutalist-card mb-6">
      <div className="card-header">
        <h2 className="brutalist-title">
          LUIGI LORE VOICE INTERFACE
        </h2>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center">
              <div className="bg-green-500 h-3 w-3 rounded-full mr-2"></div>
              <span className="text-sm font-bold">CONNECTED</span>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="bg-red-500 h-3 w-3 rounded-full mr-2"></div>
              <span className="text-sm font-bold">DISCONNECTED</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-2 border-black">
        {showApiKeyInput ? (
          <div className="flex flex-col">
            <p className="mb-4 font-mono text-sm">
              Enter your ElevenLabs API key to connect with Luigi Lore. The agent will have access to:
              <br/>- Current Ethical Score: {ethicalScore}
              <br/>- Weather State: {weatherState}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="password"
                placeholder="ElevenLabs API key (sk_...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 brutalist-input"
              />
              <Button 
                onClick={startConversation}
                className="brutalist-btn"
              >
                Connect
              </Button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Your API key will be stored in your browser's local storage. You can get a key from <a href="https://elevenlabs.io/app" target="_blank" rel="noopener noreferrer" className="underline">ElevenLabs</a>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-lg p-4 border-2 border-black mb-4 bg-gray-100 min-h-[100px] flex items-center justify-center">
              {conversation.isSpeaking ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="w-2 h-8 bg-black animate-pulse"></div>
                    <div className="w-2 h-12 bg-black animate-pulse delay-100"></div>
                    <div className="w-2 h-6 bg-black animate-pulse delay-200"></div>
                    <div className="w-2 h-10 bg-black animate-pulse delay-300"></div>
                    <div className="w-2 h-8 bg-black animate-pulse delay-400"></div>
                  </div>
                  <p className="text-sm">Luigi is speaking...</p>
                </div>
              ) : (
                <p className="text-center">
                  {isConnected ? "Speak to Luigi..." : "Connecting to Luigi Lore..."}
                </p>
              )}
            </div>
            
            <div className="flex gap-4 mt-2">
              <Button 
                onClick={() => {
                  conversation.setVolume({ volume: 0.5 });
                  toast({
                    title: "Volume Adjusted",
                    description: "Luigi's voice volume set to 50%",
                  });
                }}
                className="bg-gray-200 hover:bg-gray-300 text-black"
                disabled={!isConnected}
              >
                Volume 50%
              </Button>
              <Button 
                onClick={() => {
                  conversation.setVolume({ volume: 1.0 });
                  toast({
                    title: "Volume Adjusted",
                    description: "Luigi's voice volume set to 100%",
                  });
                }}
                className="bg-gray-200 hover:bg-gray-300 text-black"
                disabled={!isConnected}
              >
                Volume 100%
              </Button>
              <Button 
                onClick={endConversation}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={!isConnected}
              >
                End Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs">
        <strong>CURRENT VARIABLES:</strong>
        <ul className="font-mono">
          <li>current_ethical_score: {ethicalScore}</li>
          <li>current_weather_state: {weatherState}</li>
        </ul>
      </div>
    </div>
  );
};
