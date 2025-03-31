
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

  useEffect(() => {
    // Add the script tag to load ElevenLabs widget
    const script = document.createElement('script');
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    // Wait for the DOM to be fully loaded
    if (containerRef.current) {
      // Create the elevenlabs-convai element
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', '5xmHawj3HdrruGcviH3Y');
      widget.setAttribute('dynamic-variables', JSON.stringify({
        ethical_score: ethicalScore.toString(),
        weather_state: weatherState
      }));
      
      // Clear container and append the widget
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(widget);
    }

    // Cleanup function to remove script when component unmounts
    return () => {
      const existingScript = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [ethicalScore, weatherState]);

  return (
    <div className="brutalist-card elevenlabs-widget-container mb-6">
      <div className="card-header">
        <h2 className="brutalist-title">
          LUIGI LORE DIGITAL TWIN
        </h2>
      </div>
      
      <div 
        ref={containerRef}
        className="p-4 bg-gray-100 min-h-[400px] flex flex-col items-center justify-center"
      >
        {/* The elevenlabs-convai element will be injected here */}
      </div>
    </div>
  );
};
