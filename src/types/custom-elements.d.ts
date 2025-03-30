
// This file contains type definitions for custom elements used in the application

// Elevenlabs Widget globals
interface Window {
  ElevenLabsWidget?: {
    init: (options: { 
      apiKey: string;
      agentId: string;
      dynamicVariables?: Record<string, string>;
    }) => void;
    destroy: () => void;
    updateDynamicVariables: (variables: Record<string, string>) => void;
  };
}
