
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ElevenLabsWidgetProps {
  ethicalScore: number;
  weatherState: string;
}

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ 
  ethicalScore, 
  weatherState 
}) => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  
  // API key directly included for sandbox environment
  const API_KEY = "sk_341c45c68a487824abf467168934962e0e301f3a0e303cc0";
  const AGENT_ID = "5xmHawj3HdrruGcviH3Y";
  
  const showWidget = () => {
    setIsWidgetVisible(true);
  };
  
  const hideWidget = () => {
    setIsWidgetVisible(false);
  };
  
  useEffect(() => {
    // Initialize widget if window.ElevenLabsWidget exists and widget is visible
    if (isWidgetVisible && window.ElevenLabsWidget) {
      window.ElevenLabsWidget.init({
        apiKey: API_KEY,
        agentId: AGENT_ID,
        dynamicVariables: {
          ethical_score: ethicalScore.toString(),
          weather_state: weatherState
        }
      });
    }
    
    // Cleanup function
    return () => {
      if (window.ElevenLabsWidget) {
        window.ElevenLabsWidget.destroy();
      }
    };
  }, [isWidgetVisible, ethicalScore, weatherState]);
  
  // Update dynamic variables when props change
  useEffect(() => {
    if (isWidgetVisible && window.ElevenLabsWidget) {
      window.ElevenLabsWidget.updateDynamicVariables({
        ethical_score: ethicalScore.toString(),
        weather_state: weatherState
      });
    }
  }, [ethicalScore, weatherState, isWidgetVisible]);
  
  return (
    <div className="brutalist-card elevenlabs-widget-container mb-6">
      <div className="card-header">
        <h2 className="brutalist-title">
          <i className="fas fa-comment-dots mr-2"></i>
          LUIGI LORE DIGITAL TWIN
        </h2>
      </div>
      
      <div className="p-4 bg-gray-100 min-h-[400px] flex flex-col items-center justify-center">
        <div className="mb-4 space-x-4">
          <Button 
            onClick={showWidget}
            disabled={isWidgetVisible}
            variant="default"
          >
            Start Conversation
          </Button>
          <Button 
            onClick={hideWidget}
            disabled={!isWidgetVisible}
            variant="destructive"
          >
            Stop Conversation
          </Button>
        </div>
        
        <div className="mb-4">
          <p>Status: <span className={isWidgetVisible ? "text-green-600" : "text-red-600"}>
            {isWidgetVisible ? "Active" : "Inactive"}
          </span></p>
        </div>
        
        {!isWidgetVisible && (
          <div className="text-center mt-4">
            <p>Click "Start Conversation" to activate Luigi Digital Twin</p>
            <p className="text-sm text-gray-500 mt-2">
              Current ethical score: {ethicalScore}, Weather: {weatherState}
            </p>
          </div>
        )}
        
        {isWidgetVisible && (
          <div id="elevenlabs-widget-container" className="w-full h-64">
            {/* The ElevenLabs widget will be mounted here */}
          </div>
        )}
      </div>
    </div>
  );
};
