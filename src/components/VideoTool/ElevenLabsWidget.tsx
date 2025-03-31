import React, { useCallback } from "react";
import { useConversation } from '@11labs/react';
import { toast } from "@/components/ui/use-toast";

export const ElevenLabsWidget: React.FC = () => {
  // Agent ID (Consider using NEXT_PUBLIC_AGENT_ID env var)
  const AGENT_ID = "5xmHawj3HdrruGcviH3Y";
  
  // Use the hook from @11labs/react
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected');
      toast({
        title: "Connected",
        description: "Successfully connected to the agent"
      });
    },
    onDisconnect: () => {
      console.log('Disconnected');
      toast({
        title: "Disconnected",
        description: "Disconnected from the agent",
        variant: "destructive"
      });
    },
    onMessage: (message) => {
      // Handle incoming messages from the agent if needed
      console.log('Message:', message);
    },
    onError: (error) => {
      console.error('Conversation Error:', error);
      toast({
        title: "Error",
        description: `Conversation error: ${error?.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  });

  // Helper function to fetch the signed URL from your Next.js API route
  const getSignedUrl = async (): Promise<string> => {
    const apiUrl = "/api/get-signed-url"; // Use relative path for Next.js API routes
    console.log(`Fetching signed URL from ${apiUrl}`);
    try {
      // Fetch from YOUR backend API route
      const response = await fetch(apiUrl, {
        method: 'POST', // Or GET - ensure this matches your API route implementation
        headers: {
          'Content-Type': 'application/json',
        },
        // Send agentId if your backend route needs it
        body: JSON.stringify({ agentId: AGENT_ID })
      });

      if (!response.ok) {
        // Try to parse error JSON, fallback to text
        let errorBody = await response.text();
        let errorMessage = errorBody;
        try {
          const errorJson = JSON.parse(errorBody);
          errorMessage = errorJson.error || errorBody;
        } catch (parseError) {
          // Keep the raw text if JSON parsing fails
        }
        console.error(`Failed fetch response from API route: ${response.status} ${response.statusText}`, errorMessage);
        throw new Error(`Failed to get signed url (${response.status}): ${errorMessage}`);
      }

      const data = await response.json();
      const signedUrl = data.signedUrl; // Ensure backend returns 'signedUrl'

      if (!signedUrl) {
        console.error("API route returned empty signed URL.");
        throw new Error("API route returned empty signed URL");
      }
      console.log("Received signed URL successfully.");
      return signedUrl;
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      throw error; // Rethrow the error to be caught by startConversation
    }
  };

  // Function to start the conversation
  const startConversation = useCallback(async () => {
    if (conversation.status === 'connecting' || conversation.status === 'connected') {
      console.log("Already connecting or connected, ignoring start request.");
      return; // Prevent multiple attempts
    }

    console.log("Start Conversation button clicked.");
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted.");

      // Fetch the signed URL from *your* backend
      const signedUrl = await getSignedUrl(); // This throws error if it fails

      // Start the session using the hook's method and the fetched signed URL
      console.log("Attempting to start session with signed URL...");
      await conversation.startSession({
        signedUrl, // Use the correct property name as per @11labs/react docs
        // Add dynamicVariables here if supported by the hook's startSession
      });
      // Success is handled by the onConnect callback

    } catch (error: any) {
      console.error('Failed to start conversation:', error);
      toast({
        title: "Connection Failed",
        description: `Error: ${error.message || 'Could not get signed URL or start session.'}`,
        variant: "destructive"
      });
    }
  }, [conversation]); // Dependency: conversation object from the hook

  // Function to stop the conversation
  const stopConversation = useCallback(async () => {
    if (conversation.status !== 'connected') {
      console.log("Not connected, cannot stop session.");
      return;
    }
    console.log("Stop Conversation button clicked.");
    try {
      await conversation.endSession();
      // Success is handled by the onDisconnect callback
    } catch (error: any) {
      console.error("Error ending conversation:", error);
      toast({
        title: "Error",
        description: `Failed to end session: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  }, [conversation]); // Dependency: conversation object

  return (
    <div className="brutalist-card elevenlabs-widget-container mb-6">
      <div className="card-header">
        <h2 className="brutalist-title">
          LUIGI LORE DIGITAL TWIN
        </h2>
      </div>

      <div className="p-4 bg-gray-100 min-h-[400px] flex flex-col items-center justify-center">
        <div className="mb-4">
          {/* Buttons using status from the hook */}
          <button
            onClick={startConversation}
            disabled={conversation.status === 'connected' || conversation.status === 'connecting'}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-blue-300"
          >
            {conversation.status === 'connecting' ? "Connecting..." : "Start Conversation"}
          </button>
          <button
            onClick={stopConversation}
            disabled={conversation.status !== 'connected'}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-red-300"
          >
            Stop Conversation
          </button>
        </div>

        <div className="mb-4">
           {/* Status display using status from the hook */}
          <p>Status: <span className={conversation.status === 'connected' ? "text-green-600" : "text-red-600"}>
             {conversation.status}
          </span></p>
          {/* Speaking/Listening status using isSpeaking from the hook */}
          {conversation.status === 'connected' && <p>Agent is <span className="font-medium">{conversation.isSpeaking ? 'speaking' : 'listening'}</span></p>}
        </div>

        {/* Initial/Connecting message display */}
        {conversation.status === 'idle' && (
          <div className="text-center mt-4">
            <p>Click "Start Conversation" to activate Luigi Digital Twin</p>
             <p className="text-sm text-gray-500 mt-2">
               This will request microphone access.
             </p>
          </div>
        )}
        {conversation.status === 'connecting' && (
            <div className="text-center mt-4">
                <p>Connecting to ElevenLabs...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ElevenLabsWidget;
