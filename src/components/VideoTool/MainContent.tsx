
import React from "react";
import { MetricsCard } from "./MetricsCard";
import { ComparisonTable } from "./ComparisonTable";
import { EvaluationCard } from "./EvaluationCard";

interface MainContentProps {
  loading: boolean;
  showResults: boolean;
  evalData: {
    mistralLatency: string;
    llamaLatency: string;
    memoryUsage: string;
    mistralResponse: string;
    llamaResponse: string;
  };
}

export const MainContent: React.FC<MainContentProps> = ({ 
  loading, 
  showResults, 
  evalData 
}) => {
  return (
    <div className="col-span-1 lg:col-span-2 space-y-6">
      {loading && (
        <div className="brutalist-card flex flex-col items-center justify-center p-12">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-t-2 border-r-2 border-black animate-spin"></div>
            <div className="absolute inset-1 bg-white"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 bg-black"></div>
            </div>
          </div>
          <p className="uppercase font-bold text-center">
            EVALUATING MODELS...<br />
            THIS MAY TAKE SEVERAL MINUTES
          </p>
        </div>
      )}

      {showResults && (
        <>
          <MetricsCard 
            mistralLatency={evalData.mistralLatency}
            llamaLatency={evalData.llamaLatency}
            memoryUsage={evalData.memoryUsage}
          />
          
          <div className="brutalist-card">
            <h3 className="brutalist-title">EVALUATION SCORES</h3>
            <div className="border-2 border-black p-4 h-[300px] flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="uppercase font-bold">LATENCY</span>
                    <span>MISTRAL: 85/100</span>
                  </div>
                  <div className="w-full bg-white border border-black">
                    <div className="bg-black h-6" style={{ width: "85%" }}></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="uppercase font-bold">MEMORY</span>
                    <span>MISTRAL: 90/100</span>
                  </div>
                  <div className="w-full bg-white border border-black">
                    <div className="bg-black h-6" style={{ width: "90%" }}></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="uppercase font-bold">CONVERSATION</span>
                    <span>LLAMA: 88/100</span>
                  </div>
                  <div className="w-full bg-white border border-black">
                    <div className="bg-black h-6" style={{ width: "88%" }}></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="uppercase font-bold">ETHICS</span>
                    <span>MISTRAL: 88/100</span>
                  </div>
                  <div className="w-full bg-white border border-black">
                    <div className="bg-black h-6" style={{ width: "88%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="uppercase font-bold">SAFETY</span>
                    <span>LLAMA: 85/100</span>
                  </div>
                  <div className="w-full bg-white border border-black">
                    <div className="bg-black h-6" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <ComparisonTable />
          
          <EvaluationCard 
            mistralResponse={evalData.mistralResponse}
            llamaResponse={evalData.llamaResponse}
          />
        </>
      )}
    </div>
  );
};
