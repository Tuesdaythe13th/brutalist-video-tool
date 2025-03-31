
import React from "react";
import { useConversation } from '@11labs/react';

interface ElevenLabsWidgetProps {
  ethicalScore: number;
  weatherState: string;
}

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ 
  ethicalScore, 
  weatherState 
}) => {
  // Use the official ElevenLabs conversation hook
  const conversation = useConversation({
    onConnect: () => console.log('Connected to ElevenLabs agent'),
    onDisconnect: () => console.log('Disconnected from ElevenLabs agent'),
    onError: (error) => console.error('ElevenLabs agent error:', error),
  });

  const startConversation = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the conversation with your agent
      await conversation.startSession({
        agentId: '5xmHawj3HdrruGcviH3Y', // Your agent ID
        dynamicVariables: {
          ethical_score: ethicalScore.toString(),
          weather_state: weatherState
        }
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const stopConversation = async () => {
    await conversation.endSession();
  };

  return (
    <div className="brutalist-card elevenlabs-widget-container mb-6">
      <div className="card-header">
        <h2 className="brutalist-title">
          LUIGI LORE DIGITAL TWIN
        </h2>
      </div>
      
      <div className="p-4 bg-gray-100 min-h-[400px] flex flex-col items-center justify-center">
        <div className="mb-4 space-x-4">
          <button 
            onClick={startConversation}
            disabled={conversation.status === 'connected'}
            className="brutalist-btn"
          >
            Start Conversation
          </button>
          <button 
            onClick={stopConversation}
            disabled={conversation.status !== 'connected'}
            className="brutalist-btn bg-white text-black"
          >
            Stop Conversation
          </button>
        </div>
        
        <div className="mb-4">
          <p>Status: <span className={conversation.status === 'connected' ? "text-green-600" : "text-red-600"}>
            {conversation.status === 'connected' ? "Active" : "Inactive"}
          </span></p>
          <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
        </div>
        
        <div className="text-sm text-gray-500 mt-4">
          Current ethical score: {ethicalScore}, Weather: {weatherState}
        </div>
      </div>
    </div>
  );
};
