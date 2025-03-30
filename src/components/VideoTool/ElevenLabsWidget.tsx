
import React, { useState, useEffect, useRef } from "react";
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
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(true);
  const [isWidgetInitialized, setIsWidgetInitialized] = useState<boolean>(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Check for stored API key on component mount
  useEffect(() => {
    const storedKey = window.localStorage.getItem("elevenlabs_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      setShowApiKeyInput(false);
    }
  }, []);

  // Handle widget initialization when API key is provided
  useEffect(() => {
    if (!showApiKeyInput && apiKey && !isWidgetInitialized) {
      try {
        // Initialize the widget using the global Window.ElevenLabsWidget object
        if (window.ElevenLabsWidget) {
          window.ElevenLabsWidget.init({
            apiKey: apiKey,
            agentId: "5xmHawj3HdrruGcviH3Y",
            dynamicVariables: {
              current_ethical_score: ethicalScore.toString(),
              current_weather_state: weatherState
            }
          });
          
          setIsWidgetInitialized(true);
          
          toast({
            title: "ElevenLabs Widget Initialized",
            description: "Luigi Lore widget is now ready!",
          });
        } else {
          console.error("ElevenLabsWidget is not available on window object");
          toast({
            title: "Widget Initialization Failed",
            description: "ElevenLabs widget script hasn't loaded yet. Please try again in a moment.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error initializing ElevenLabs widget:", error);
        toast({
          title: "Widget Initialization Failed",
          description: "There was an error initializing the ElevenLabs widget.",
          variant: "destructive",
        });
        setIsWidgetInitialized(false);
      }
    }
  }, [showApiKeyInput, apiKey, isWidgetInitialized, ethicalScore, weatherState]);

  // Update dynamic variables when they change
  useEffect(() => {
    if (isWidgetInitialized && window.ElevenLabsWidget) {
      try {
        window.ElevenLabsWidget.updateDynamicVariables({
          current_ethical_score: ethicalScore.toString(),
          current_weather_state: weatherState
        });
      } catch (error) {
        console.error("Failed to update widget dynamic variables:", error);
      }
    }
  }, [ethicalScore, weatherState, isWidgetInitialized]);

  const initializeWidget = () => {
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
    } catch (error) {
      console.error("Failed to initialize widget:", error);
      toast({
        title: "Widget Initialization Failed",
        description: "Could not initialize the ElevenLabs widget. Please check your API key.",
        variant: "destructive",
      });
    }
  };

  const removeWidget = () => {
    try {
      if (window.ElevenLabsWidget) {
        window.ElevenLabsWidget.destroy();
      }
      setIsWidgetInitialized(false);
      setShowApiKeyInput(true);
      localStorage.removeItem("elevenlabs_api_key");
      toast({
        title: "Widget Removed",
        description: "ElevenLabs widget has been removed.",
      });
    } catch (error) {
      console.error("Error removing widget:", error);
    }
  };

  return (
    <div className="brutalist-card mb-6">
      <div className="card-header">
        <h2 className="brutalist-title">
          LUIGI LORE VOICE INTERFACE
        </h2>
        <div className="flex items-center gap-2">
          {isWidgetInitialized ? (
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
              <input 
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
                Initialize Widget
              </Button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Your API key will be stored in your browser's local storage. You can get a key from <a href="https://elevenlabs.io/app" target="_blank" rel="noopener noreferrer" className="underline">ElevenLabs</a>.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="mb-4">
              Luigi Lore widget is now active! You should see the widget button in the corner of your screen.
            </p>
            <Button 
              onClick={removeWidget}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Remove Widget
            </Button>
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

      {/* Add the direct elevenlabs-convai element to the DOM for direct widget initialization */}
      {!showApiKeyInput && apiKey && (
        <div ref={widgetRef} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
          <elevenlabs-convai 
            agent-id="5xmHawj3HdrruGcviH3Y"
            api-key={apiKey}
            dynamic-variables={JSON.stringify({
              current_ethical_score: ethicalScore.toString(),
              current_weather_state: weatherState
            })}
          />
        </div>
      )}
    </div>
  );
};
