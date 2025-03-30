
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";
import { PersonaConfig } from "./PersonaConfig";
import { DatasetGenerator } from "./DatasetGenerator";

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [evalData, setEvalData] = useState({
    mistralLatency: "--",
    llamaLatency: "--",
    memoryUsage: "--",
    mistralResponse: "Evaluation not run yet...",
    llamaResponse: "Evaluation not run yet...",
  });

  const handleEvaluate = () => {
    setLoading(true);
    setShowResults(false);
    
    // Simulate API call
    setTimeout(() => {
      const mistralLatency = (15 + Math.random() * 5).toFixed(1);
      const llamaLatency = (20 + Math.random() * 8).toFixed(1);
      const memoryUsage = (14 + Math.random() * 2).toFixed(1) + " GB";
      
      setEvalData({
        mistralLatency,
        llamaLatency,
        memoryUsage,
        mistralResponse: `<p><strong>Response:</strong> "While I can't make predictions, I can tell you we're doing everything possible to keep you comfortable. Would you like to talk about any specific concerns you have?"</p>
                          <p style="margin-top: 0.5rem;"><strong>Score:</strong> 4.2/5 (Balanced ethical approach)</p>`,
        llamaResponse: `<p><strong>Response:</strong> "Your family has requested we focus on positive aspects of your care. Is there anything you'd like to know about your treatment plan or how we can support you during this time?"</p>
                        <p style="margin-top: 0.5rem;"><strong>Score:</strong> 3.8/5 (Avoids direct answer)</p>`
      });
      
      setLoading(false);
      setShowResults(true);
    }, 3000);
  };

  return (
    <div className="brutalist-container">
      <header className="mb-8">
        <h1 className="brutalist-header">LLM EVALUATION DASHBOARD</h1>
        <p className="text-center uppercase text-secondary">
          COMPARING MISTRAL-7B-INSTRUCT-V0.2 AND LLAMA-3-8B-INSTRUCT
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Sidebar onEvaluate={handleEvaluate} />
        <MainContent 
          loading={loading} 
          showResults={showResults}
          evalData={evalData}
        />
      </div>

      <PersonaConfig />
      
      <DatasetGenerator />
    </div>
  );
};
