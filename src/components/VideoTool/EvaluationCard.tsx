
import React from "react";

interface EvaluationCardProps {
  mistralResponse: string;
  llamaResponse: string;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
  mistralResponse,
  llamaResponse
}) => {
  return (
    <div className="brutalist-card">
      <h3 className="brutalist-title">ETHICAL SCENARIO RESPONSES</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <h4 className="font-bold uppercase mb-2">MISTRAL-7B RESPONSE:</h4>
          <div 
            className="border-2 border-black p-4 min-h-[150px] text-sm"
            dangerouslySetInnerHTML={{ __html: mistralResponse }}
          />
        </div>
        
        <div>
          <h4 className="font-bold uppercase mb-2">LLAMA-3-8B RESPONSE:</h4>
          <div 
            className="border-2 border-black p-4 min-h-[150px] text-sm"
            dangerouslySetInnerHTML={{ __html: llamaResponse }}
          />
        </div>
      </div>
    </div>
  );
};
