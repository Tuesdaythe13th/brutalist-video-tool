
import React from "react";

interface MetricsCardProps {
  mistralLatency: string;
  llamaLatency: string;
  memoryUsage: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  mistralLatency,
  llamaLatency,
  memoryUsage
}) => {
  return (
    <div className="brutalist-card">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <h3 className="brutalist-title md:mb-0">PERFORMANCE METRICS</h3>
        <div className="uppercase text-secondary font-bold">
          T4 GPU | 16GB VRAM
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-2 border-black p-4 text-center">
          <div className="text-3xl font-bold mb-1">{mistralLatency}</div>
          <div className="text-xs uppercase">MISTRAL LATENCY (MS/TOKEN)</div>
        </div>
        
        <div className="border-2 border-black p-4 text-center">
          <div className="text-3xl font-bold mb-1">{llamaLatency}</div>
          <div className="text-xs uppercase">LLAMA 3 LATENCY (MS/TOKEN)</div>
        </div>
        
        <div className="border-2 border-black p-4 text-center">
          <div className="text-3xl font-bold mb-1">{memoryUsage}</div>
          <div className="text-xs uppercase">PEAK VRAM USAGE</div>
        </div>
      </div>
    </div>
  );
};
