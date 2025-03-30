
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useConversation } from "@11labs/react";

interface ElevenLabsWidgetProps {
  ethicalScore: number;
  weatherState: string;
}

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ 
  ethicalScore, 
  weatherState 
}) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState<boolean>(false);
  
  // Create the prompt with the dynamic variables
  const getPrompt = () => `You are Luigi Lore, an assistant that helps with ethical assessment. 
    You have access to the following dynamic information:
    - Current Ethical Score: ${ethicalScore}
    - Current Weather: ${weatherState}`;

  // Use the official ElevenLabs React hook with the dynamic prompt
  const conversation = useConversation({
    overrides: {
      agent: {
        prompt: {
          prompt: getPrompt(),
        },
        language: "en",
      },
    },
    onConnect: () => {
      toast({
        title: "ElevenLabs Connected",
        description: "Voice assistant connected successfully!",
      });
      setIsInitialized(true);
    },
    onDisconnect: () => {
      setIsInitialized(false);
      toast({
        title: "ElevenLabs Disconnected",
        description: "Voice assistant connection ended.",
      });
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      toast({
        title: "Connection Error",
        description: "There was an error with the voice assistant.",
        variant: "destructive",
      });
      setIsInitialized(false);
    }
  });
  
  // Auto-initialize widget if API key exists in storage
  useEffect(() => {
    const storedKey = window.localStorage.getItem("elevenlabs_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      setShowApiKeyInput(false);
      
      // Auto-initialize the widget with the stored key
      const autoInitialize = async () => {
        try {
          await conversation.startSession({
            agentId: "5xmHawj3HdrruGcviH3Y",
            authorization: storedKey
          });
        } catch (error) {
          console.error("Auto-initialization failed:", error);
          // If auto-init fails, show API key input again
          setShowApiKeyInput(true);
          toast({
            title: "Connection Failed",
            description: "Saved API key is invalid or expired. Please enter a new key.",
            variant: "destructive",
          });
        }
      };
      
      autoInitialize();
    }
    setHasCheckedStorage(true);
  }, []);

  // Update conversation when ethicalScore or weatherState change
  useEffect(() => {
    if (isInitialized) {
      // The useConversation hook will re-render with the updated values
      console.log("Dynamic variables updated:", { ethicalScore, weatherState });
    }
  }, [ethicalScore, weatherState, isInitialized]);

  const initializeWidget = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key",
        variant: "destructive",
      });
      return;
    }

    try {
      // Store API key in localStorage
      window.localStorage.setItem("elevenlabs_api_key", apiKey);
      setShowApiKeyInput(false);
      
      // Start the conversation session with correct parameter structure
      await conversation.startSession({
        agentId: "5xmHawj3HdrruGcviH3Y",
        authorization: apiKey // Use authorization instead of apiKey
      });
      
    } catch (error) {
      console.error("Failed to initialize widget:", error);
      toast({
        title: "Widget Initialization Failed",
        description: "Could not initialize the ElevenLabs widget. Please check your API key.",
        variant: "destructive",
      });
    }
  };

  const removeWidget = async () => {
    try {
      await conversation.endSession();
      setIsInitialized(false);
      setShowApiKeyInput(true);
      localStorage.removeItem("elevenlabs_api_key");
      toast({
        title: "Widget Removed",
        description: "ElevenLabs voice assistant has been removed.",
      });
    } catch (error) {
      console.error("Error removing widget:", error);
    }
  };

  if (!hasCheckedStorage) {
    return (
      <div className="brutalist-card mb-6">
        <div className="card-header">
          <h2 className="brutalist-title">LUIGI LORE VOICE INTERFACE</h2>
        </div>
        <div className="p-4 border-2 border-black flex justify-center items-center">
          <p>Loading voice assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="brutalist-card mb-6">
      <div className="card-header">
        <h2 className="brutalist-title">
          LUIGI LORE VOICE INTERFACE
        </h2>
        <div className="flex items-center gap-2">
          {isInitialized ? (
            <div className="flex items-center">
              <div className="bg-green-500 h-3 w-3 rounded-full mr-2"></div>
              <span className="text-sm font-bold">WIDGET ACTIVE</span>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="bg-red-500 h-3 w-3 rounded-full mr-2"></div>
              <span className="text-sm font-bold">WIDGET INACTIVE</span>
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
              <Input 
                type="password"
                placeholder="ElevenLabs API key (sk_...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 brutalist-input"
              />
              <Button 
                onClick={initializeWidget}
                className="brutalist-btn"
              >
                Initialize Voice Assistant
              </Button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Your API key will be stored in your browser's local storage. You can get a key from <a href="https://elevenlabs.io/app" target="_blank" rel="noopener noreferrer" className="underline">ElevenLabs</a>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-center mb-4">
              <p className="mb-2">
                Luigi Lore voice assistant is {isInitialized ? "active" : "initializing"}!
              </p>
              {isInitialized ? (
                <p className="text-sm text-green-600 font-bold">Try talking to Luigi Lore now!</p>
              ) : (
                <p className="text-sm text-amber-600">Please wait while the assistant initializes...</p>
              )}
            </div>
            <div className="flex gap-4 items-center">
              {conversation.isSpeaking && (
                <div className="flex items-center">
                  <div className="animate-pulse bg-blue-500 h-3 w-3 rounded-full mr-2"></div>
                  <span className="text-sm">Speaking...</span>
                </div>
              )}
              <Button 
                onClick={removeWidget}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Remove Voice Assistant
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

      {/* Status indicator */}
      {!showApiKeyInput && (
        <div className="mt-4 p-2 border border-black">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs">STATUS:</span>
            <span className="text-xs">{conversation.status}</span>
          </div>
        </div>
      )}
    </div>
  );
};
