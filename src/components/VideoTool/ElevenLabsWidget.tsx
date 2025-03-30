
import React, { useEffect, useRef } from "react";

interface ElevenLabsWidgetProps {
  ethicalScore: number;
  weatherState: string;
}

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ 
  ethicalScore, 
  weatherState 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  
  // API key directly included for sandbox environment
  const API_KEY = "sk_341c45c68a487824abf467168934962e0e301f3a0e303cc0";
  const AGENT_ID = "5xmHawj3HdrruGcviH3Y";
  
  // Function to load the ElevenLabs script
  const loadScript = () => {
    return new Promise<void>((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]')) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = "https://elevenlabs.io/convai-widget/index.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    });
  };
  
  // Initialize the widget
  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;
    
    const initWidget = async () => {
      try {
        await loadScript();
        
        // Short delay to ensure the widget script is fully loaded
        setTimeout(() => {
          if (window.ElevenLabsWidget && !initialized.current) {
            console.log("Initializing ElevenLabs widget...");
            
            window.ElevenLabsWidget.init({
              apiKey: API_KEY,
              agentId: AGENT_ID,
              dynamicVariables: {
                ethical_score: ethicalScore.toString(),
                weather_state: weatherState
              }
            });
            
            initialized.current = true;
            console.log("Widget initialized successfully");
          }
        }, 500);
      } catch (error) {
        console.error("Failed to load ElevenLabs widget:", error);
      }
    };
    
    initWidget();
    
    // Cleanup function
    return () => {
      if (window.ElevenLabsWidget && initialized.current) {
        window.ElevenLabsWidget.destroy();
        initialized.current = false;
        console.log("Widget destroyed");
      }
    };
  }, []);
  
  // Update dynamic variables when props change
  useEffect(() => {
    if (window.ElevenLabsWidget && initialized.current) {
      console.log("Updating dynamic variables:", { ethical_score: ethicalScore, weather_state: weatherState });
      
      window.ElevenLabsWidget.updateDynamicVariables({
        ethical_score: ethicalScore.toString(),
        weather_state: weatherState
      });
    }
  }, [ethicalScore, weatherState]);
  
  return (
    <div ref={containerRef} className="brutalist-card elevenlabs-widget-container mb-6">
      <div className="card-header">
        <h2 className="brutalist-title">
          <i className="fas fa-comment-dots mr-2"></i>
          LUIGI LORE DIGITAL TWIN
        </h2>
      </div>
      
      <div className="p-4 bg-gray-100 min-h-[400px] flex items-center justify-center">
        <elevenlabs-convai 
          agent-id={AGENT_ID}
          api-key={API_KEY}
          dynamic-variables={JSON.stringify({
            ethical_score: ethicalScore.toString(),
            weather_state: weatherState
          })}
        ></elevenlabs-convai>
        
        {!initialized.current && (
          <div className="text-center">
            <div className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4"></div>
            <p className="mt-2">Loading Luigi Digital Twin...</p>
          </div>
        )}
      </div>
    </div>
  );
};
