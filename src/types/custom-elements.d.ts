
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

// ElevenLabs convai widget element
declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      'agent-id'?: string;
      'dynamic-variables'?: string;
      'api-key'?: string;
    }, HTMLElement>;
  }
}
