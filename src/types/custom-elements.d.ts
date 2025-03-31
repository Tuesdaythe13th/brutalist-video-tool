
// Global TypeScript definitions for custom elements 
declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      'agent-id'?: string;
      'api-key'?: string;
      'dynamic-variables'?: string;
    }, HTMLElement>;
  }
}

interface Window {
  ElevenLabsWidget?: {
    init: (config: {
      apiKey: string;
      agentId: string;
      dynamicVariables?: Record<string, string>;
    }) => void;
    destroy: () => void;
    updateDynamicVariables: (variables: Record<string, string>) => void;
  };
}

declare module '@11labs/client' {
  export interface ConversationOptions {
    agentId: string;
    apiKey?: string;
    dynamicVariables?: Record<string, string>;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: any) => void;
    onModeChange?: (mode: { mode: string }) => void;
  }

  export class Conversation {
    static startSession(options: ConversationOptions): Promise<any>;
    endSession(): Promise<void>;
    updateDynamicVariables(variables: Record<string, string>): void;
  }
}
