
import React, { useState } from "react";
import { useConversation } from '@11labs/react';
import { toast } from "@/components/ui/use-toast";

export const ElevenLabsWidget: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Use a constant for the agent ID
  const AGENT_ID = "5xmHawj3HdrruGcviH3Y";
  
  // Initialize the conversation hook from @11labs/react
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs agent");
      toast({
        title: "Connected",
        description: "Successfully connected to the ElevenLabs agent",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs agent");
      toast({
        title: "Disconnected",
        description: "Disconnected from the ElevenLabs agent",
        variant: "destructive"
      });
    },
    onError: (error) => {
      console.error("ElevenLabs conversation error:", error);
      toast({
        title: "Error",
        description: "An error occurred with the ElevenLabs conversation",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  });

  // Helper function to get signed URL from our Next.js API
  const getSignedUrl = async () => {
    try {
      console.log(`Fetching signed URL from API for agent: ${AGENT_ID}`);
      
      const response = await fetch('/api/get-signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId: AGENT_ID })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch signed URL: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const signedUrl = data.signed_url || data.signedUrl;

      if (!signedUrl) {
        throw new Error("Received empty signed URL");
      }

      console.log("Successfully received signed URL");
      return signedUrl;
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      throw error;
    }
  };
  
  const startConversation = async () => {
    try {
      setIsLoading(true);
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get signed URL from API
      const signedUrl = await getSignedUrl();
      
      // Start the conversation using the hook's startSession method
      await conversation.startSession({ 
        url: signedUrl
      });
      
    } catch (error) {
      console.error("Failed to start ElevenLabs conversation:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to ElevenLabs. Please try again later.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const stopConversation = async () => {
    try {
      await conversation.endSession();
      console.log("Conversation ended");
      toast({
        title: "Conversation Ended",
        description: "The conversation has been ended successfully",
      });
    } catch (error) {
      console.error("Error ending conversation:", error);
      toast({
        title: "Error",
        description: "Failed to end the conversation properly",
        variant: "destructive"
      });
    }
  };

  // Determine if the conversation is connected
  const isConnected = conversation.status === "connected";
  
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
            disabled={isConnected || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-blue-300"
          >
            {isLoading ? "Connecting..." : "Start Conversation"}
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
          {isConnected && <p>Agent is <span className="font-medium">{conversation.isSpeaking ? "speaking" : "listening"}</span></p>}
        </div>
        
        {!isConnected && !isLoading && (
          <div className="text-center mt-4">
            <p>Click "Start Conversation" to activate Luigi Digital Twin</p>
            <p className="text-sm text-gray-500 mt-2">
              This will request microphone access to enable voice interaction.
            </p>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center mt-4">
            <p>Connecting to ElevenLabs...</p>
            <p className="text-sm text-gray-500 mt-2">
              This may take a few moments
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
