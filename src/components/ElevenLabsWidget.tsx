
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
  const API_KEY = "sk_341c45c68a487824abf467168934962e0e303cc0";
  const AGENT_ID = "5xmHawj3HdrruGcviH3Y";
  
  const showWidget = () => {
    setIsWidgetVisible(true);
  };
  
  const hideWidget = () => {
    setIsWidgetVisible(false);
    // Clear the widget container
    const container = document.getElementById('elevenlabs-widget-container');
    if (container) {
      container.innerHTML = '';
    }
    
    // Destroy widget instance if it exists
    if (window.ElevenLabsWidget) {
      window.ElevenLabsWidget.destroy();
    }
  };
  
  useEffect(() => {
    // Only initialize when widget should be visible
    if (isWidgetVisible) {
      // Create the elevenlabs-convai element
      const widgetContainer = document.getElementById('elevenlabs-widget-container');
      if (widgetContainer) {
        // Clear any existing content
        widgetContainer.innerHTML = '';
        
        // Create and append the custom element
        const widgetElement = document.createElement('elevenlabs-convai');
        widgetElement.setAttribute('agent-id', AGENT_ID);
        
        // Set dynamic variables
        const dynamicVars = {
          ethical_score: ethicalScore.toString(),
          weather_state: weatherState
        };
        widgetElement.setAttribute('dynamic-variables', JSON.stringify(dynamicVars));
        
        widgetContainer.appendChild(widgetElement);
        
        // Log that we're trying to add the widget
        console.log('Adding ElevenLabs widget to container', widgetElement);
      } else {
        console.error('Widget container not found');
      }
    }
    
    // Cleanup function
    return () => {
      if (isWidgetVisible && window.ElevenLabsWidget) {
        window.ElevenLabsWidget.destroy();
      }
    };
  }, [isWidgetVisible, ethicalScore, weatherState]);
  
  return (
    <div className="brutalist-card elevenlabs-widget-container mb-6">
      <div className="card-header">
        <h2 className="brutalist-title">
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
        
        {/* This is where the widget will be mounted */}
        <div 
          id="elevenlabs-widget-container" 
          className={`w-full ${isWidgetVisible ? 'block' : 'hidden'} h-96 border-2 border-black p-4`}
        ></div>
      </div>
    </div>
  );
};
