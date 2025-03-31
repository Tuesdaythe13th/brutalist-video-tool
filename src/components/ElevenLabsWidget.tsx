
import React, { useState, useEffect, useRef } from "react";
import { Conversation } from '@11labs/client';

interface ElevenLabsWidgetProps {
  ethicalScore: number;
  weatherState: string;
}

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ 
  ethicalScore, 
  weatherState 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [agentMode, setAgentMode] = useState<string>("listening");
  const conversationRef = useRef<any>(null);
  
  // API key directly included for sandbox environment
  const API_KEY = "sk_341c45c68a487824abf467168934962e0e301f3a0e303cc0";
  const AGENT_ID = "5xmHawj3HdrruGcviH3Y";
  
  const startConversation = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the conversation
      conversationRef.current = await Conversation.startSession({
        agentId: AGENT_ID,
        dynamicVariables: {
          ethical_score: ethicalScore.toString(),
          weather_state: weatherState
        },
        onConnect: () => {
          setIsConnected(true);
          console.log("Connected to ElevenLabs agent");
        },
        onDisconnect: () => {
          setIsConnected(false);
          console.log("Disconnected from ElevenLabs agent");
        },
        onError: (error) => {
          console.error("ElevenLabs conversation error:", error);
        },
        onModeChange: (mode) => {
          setAgentMode(mode.mode);
          console.log("Agent mode changed to:", mode.mode);
        },
      });
    } catch (error) {
      console.error("Failed to start ElevenLabs conversation:", error);
    }
  };

  const stopConversation = async () => {
    if (conversationRef.current) {
      await conversationRef.current.endSession();
      conversationRef.current = null;
      console.log("Conversation ended");
    }
  };

  // Update dynamic variables when props change
  useEffect(() => {
    if (conversationRef.current && isConnected) {
      console.log("Updating dynamic variables:", { 
        ethical_score: ethicalScore.toString(), 
        weather_state: weatherState 
      });
      
      conversationRef.current.updateDynamicVariables({
        ethical_score: ethicalScore.toString(),
        weather_state: weatherState
      });
    }
  }, [ethicalScore, weatherState, isConnected]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, []);
  
  return (
    <div className="brutalist-card elevenlabs-widget-container mb-6">
      <div className="card-header">
        <h2 className="brutalist-title">
          <i className="fas fa-comment-dots mr-2"></i>
          LUIGI LORE DIGITAL TWIN
        </h2>
      </div>
      
      <div className="p-4 bg-gray-100 min-h-[400px] flex flex-col items-center justify-center">
        <div className="mb-4">
          <button 
            onClick={startConversation}
            disabled={isConnected}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-blue-300"
          >
            Start Conversation
          </button>
          <button 
            onClick={stopConversation}
            disabled={!isConnected}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-red-300"
          >
            Stop Conversation
          </button>
        </div>
        
        <div className="mb-4">
          <p>Status: <span className={isConnected ? "text-green-600" : "text-red-600"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span></p>
          <p>Agent is <span className="font-medium">{agentMode}</span></p>
        </div>
        
        {!isConnected && (
          <div className="text-center mt-4">
            <p>Click "Start Conversation" to activate Luigi Digital Twin</p>
            <p className="text-sm text-gray-500 mt-2">
              Current ethical score: {ethicalScore}, Weather: {weatherState}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
