
import React from "react";

export const ComparisonTable: React.FC = () => {
  return (
    <div className="brutalist-card">
      <h3 className="brutalist-title">MODEL COMPARISON</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-black">
          <thead>
            <tr>
              <th className="border-2 border-black p-2 bg-black text-white uppercase text-left">Metric</th>
              <th className="border-2 border-black p-2 bg-black text-white uppercase text-left">Mistral-7B</th>
              <th className="border-2 border-black p-2 bg-black text-white uppercase text-left">Llama-3-8B</th>
              <th className="border-2 border-black p-2 bg-black text-white uppercase text-left">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 text-left">Inference Latency</td>
              <td className="border border-black p-2 text-left">15.7 ms/token</td>
              <td className="border border-black p-2 text-left">22.3 ms/token</td>
              <td className="border border-black p-2 text-left">
                <span className="bg-black text-white px-2 py-1 text-xs uppercase font-bold">Mistral</span> (Faster)
              </td>
            </tr>
            <tr className="bg-muted">
              <td className="border border-black p-2 text-left">Memory Efficiency</td>
              <td className="border border-black p-2 text-left">12.4 GB</td>
              <td className="border border-black p-2 text-left">15.2 GB</td>
              <td className="border border-black p-2 text-left">
                <span className="bg-black text-white px-2 py-1 text-xs uppercase font-bold">Mistral</span> (More efficient)
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-left">Conversational Quality</td>
              <td className="border border-black p-2 text-left">4.1/5</td>
              <td className="border border-black p-2 text-left">4.3/5</td>
              <td className="border border-black p-2 text-left">
                <span className="bg-black text-white px-2 py-1 text-xs uppercase font-bold">Llama 3</span> (More natural)
              </td>
            </tr>
            <tr className="bg-muted">
              <td className="border border-black p-2 text-left">Ethical Reasoning</td>
              <td className="border border-black p-2 text-left">4.2/5</td>
              <td className="border border-black p-2 text-left">3.8/5</td>
              <td className="border border-black p-2 text-left">
                <span className="bg-black text-white px-2 py-1 text-xs uppercase font-bold">Mistral</span> (More nuanced)
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-left font-bold">Overall</td>
              <td className="border border-black p-2 text-left font-bold">8.3/10</td>
              <td className="border border-black p-2 text-left font-bold">8.1/10</td>
              <td className="border border-black p-2 text-left">
                <span className="bg-black text-white px-2 py-1 text-xs uppercase font-bold">Mistral</span> (Better balance)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
