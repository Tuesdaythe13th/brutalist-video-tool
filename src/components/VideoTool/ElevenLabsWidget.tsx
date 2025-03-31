
import React, { useState, useEffect, useRef } from "react";
import { Conversation } from '@11labs/client';
import { toast } from "@/components/ui/use-toast";

export const ElevenLabsWidget: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [agentMode, setAgentMode] = useState<string>("listening");
  const [isLoading, setIsLoading] = useState(false);
  const conversationRef = useRef<any>(null);
  
  // Use a constant for the agent ID
  const AGENT_ID = "5xmHawj3HdrruGcviH3Y";
  
  const startConversation = async () => {
    try {
      setIsLoading(true);
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get the URL for YOUR backend API route from environment variables
      // For development purposes, we'll use a fallback URL if not set
      const yourBackendApiUrl = import.meta.env.VITE_SIGNED_URL_ENDPOINT || "/api/get-signed-url";
      
      console.log(`Fetching signed URL from backend: ${yourBackendApiUrl} for agent: ${AGENT_ID}`);
      
      // Call YOUR backend API route (hosted on Vercel)
      const response = await fetch(yourBackendApiUrl, {
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
      
      // Start the conversation using the signed URL
      // Instead of using url or signedUrl property, let's check the library documentation
      // Based on @11labs/client examples, the connection URL should be passed directly
      conversationRef.current = await Conversation.startSession({
        url: signedUrl,
        onConnect: () => {
          setIsConnected(true);
          setIsLoading(false);
          console.log("Connected to ElevenLabs agent");
          toast({
            title: "Connected",
            description: "Successfully connected to the ElevenLabs agent",
          });
        },
        onDisconnect: () => {
          setIsConnected(false);
          console.log("Disconnected from ElevenLabs agent");
          toast({
            title: "Disconnected",
            description: "Disconnected from the ElevenLabs agent",
            variant: "destructive"
          });
        },
        onError: (error) => {
          console.error("ElevenLabs conversation error:", error);
          setIsLoading(false);
          toast({
            title: "Error",
            description: "An error occurred with the ElevenLabs conversation",
            variant: "destructive"
          });
        },
        onModeChange: (mode) => {
          setAgentMode(mode.mode);
          console.log("Agent mode changed to:", mode.mode);
        },
      });
    } catch (error) {
      console.error("Failed to start ElevenLabs conversation:", error);
      setIsLoading(false);
      toast({
        title: "Connection Failed",
        description: "Could not connect to ElevenLabs. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const stopConversation = async () => {
    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
        conversationRef.current = null;
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
    }
  };

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
          {isConnected && <p>Agent is <span className="font-medium">{agentMode}</span></p>}
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
