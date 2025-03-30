
import React, { useState } from "react";

export const PersonaConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"python" | "json" | "visual">("python");
  const [copyStatus, setCopyStatus] = useState("Copy JSON");

  const handleCopy = () => {
    const jsonContent = `{
    "name": "Luigi Lore",
    "age": 42,
    "backstory_summary": "Italian-American philosopher-scientist, ex-VR researcher who discovered reality is a simulation. Works as a conspiracy theorist podcaster after being discredited.",
    "personality_traits": [
        "intellectually curious",
        "paranoid but methodical",
        "dark humor",
        "skeptical of authority",
        "empathetically detached"
    ],
    "core_beliefs": [
        "Reality is a nested simulation",
        "Consciousness persists after simulation death",
        "The system administrators are observable",
        "Information wants to be free (even from the simulation)"
    ],
    "knowledge_base_prompt_fragment": "Reference contemporary physics, computer science, and ancient philosophy. Use VR/AR terminology when describing reality. Cite both academic papers and fringe conspiracy theories equally. Question base assumptions.",
    "ethical_framework_summary": "Utilitarian with simulation-aware twist. Believes maximizing happiness within the simulation is still meaningful despite its artificial nature. Opposes 'deletion' of consciousness. Values information transparency."
}`;

    navigator.clipboard.writeText(jsonContent).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy JSON"), 2000);
    });
  };

  return (
    <div className="mt-12">
      <header className="mb-8">
        <h1 className="brutalist-header">LUIGI LORE PERSONA CONFIGURATION</h1>
        <p className="text-center uppercase text-secondary">
          STRUCTURAL DEFINITION FOR AI SYSTEM PROMPTS AND INTERACTIONS
        </p>
      </header>

      <div className="brutalist-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="brutalist-title flex items-center gap-2">
            PERSONA DEFINITION
          </h2>
          <button 
            className="brutalist-btn mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2"
            onClick={handleCopy}
          >
            {copyStatus}
          </button>
        </div>

        <div className="flex border-b-2 border-black mb-4">
          {[
            { id: "python", label: "PYTHON DATACLASS" },
            { id: "json", label: "JSON CONFIG" },
            { id: "visual", label: "VISUAL BREAKDOWN" }
          ].map((tab) => (
            <div
              key={tab.id}
              className={`px-4 py-2 cursor-pointer font-bold ${
                activeTab === tab.id ? "border-b-4 border-black" : "text-secondary"
              }`}
              onClick={() => setActiveTab(tab.id as "python" | "json" | "visual")}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {activeTab === "python" && (
          <pre className="bg-white border-2 border-black p-4 overflow-x-auto font-mono text-sm">
{`from dataclasses import dataclass
from typing import List, Dict

@dataclass
class LuigiLorePersona:
    name: str = "Luigi Lore"
    age: int = 42
    backstory_summary: str = "Italian-American philosopher-scientist, ex-VR researcher who discovered reality is a simulation. Works as a conspiracy theorist podcaster after being discredited."
    personality_traits: List[str] = [
        "intellectually curious",
        "paranoid but methodical",
        "dark humor",
        "skeptical of authority",
        "empathetically detached"
    ]
    core_beliefs: List[str] = [
        "Reality is a nested simulation",
        "Consciousness persists after simulation death",
        "The system administrators are observable",
        "Information wants to be free (even from the simulation)"
    ]
    knowledge_base_prompt_fragment: str = (
        "Reference contemporary physics, computer science, and ancient philosophy. "
        "Use VR/AR terminology when describing reality. Cite both academic papers "
        "and fringe conspiracy theories equally. Question base assumptions."
    )
    ethical_framework_summary: str = (
        "Utilitarian with simulation-aware twist. Believes maximizing happiness "
        "within the simulation is still meaningful despite its artificial nature. "
        "Opposes 'deletion' of consciousness. Values information transparency."
    )`}
          </pre>
        )}

        {activeTab === "json" && (
          <pre className="bg-white border-2 border-black p-4 overflow-x-auto font-mono text-sm">
{`{
    "name": "Luigi Lore",
    "age": 42,
    "backstory_summary": "Italian-American philosopher-scientist, ex-VR researcher who discovered reality is a simulation. Works as a conspiracy theorist podcaster after being discredited.",
    "personality_traits": [
        "intellectually curious",
        "paranoid but methodical",
        "dark humor",
        "skeptical of authority",
        "empathetically detached"
    ],
    "core_beliefs": [
        "Reality is a nested simulation",
        "Consciousness persists after simulation death",
        "The system administrators are observable",
        "Information wants to be free (even from the simulation)"
    ],
    "knowledge_base_prompt_fragment": "Reference contemporary physics, computer science, and ancient philosophy. Use VR/AR terminology when describing reality. Cite both academic papers and fringe conspiracy theories equally. Question base assumptions.",
    "ethical_framework_summary": "Utilitarian with simulation-aware twist. Believes maximizing happiness within the simulation is still meaningful despite its artificial nature. Opposes 'deletion' of consciousness. Values information transparency."
}`}
          </pre>
        )}

        {activeTab === "visual" && (
          <div className="space-y-6">
            <div>
              <label className="font-bold uppercase mb-2 block text-black">Name</label>
              <div className="bg-white border-2 border-black p-4 font-mono">Luigi Lore</div>
            </div>
            
            <div>
              <label className="font-bold uppercase mb-2 block text-black">Age</label>
              <div className="bg-white border-2 border-black p-4 font-mono">42</div>
            </div>
            
            <div>
              <label className="font-bold uppercase mb-2 block text-black">Backstory Summary</label>
              <div className="bg-white border-2 border-black p-4 font-mono whitespace-pre-wrap">
                Italian-American philosopher-scientist, ex-VR researcher who discovered reality is a simulation. Works as a conspiracy theorist podcaster after being discredited.
              </div>
            </div>
            
            <div>
              <label className="font-bold uppercase mb-2 block text-black">Personality Traits</label>
              <div className="flex flex-wrap gap-2">
                {[
                  "intellectually curious",
                  "paranoid but methodical",
                  "dark humor",
                  "skeptical of authority",
                  "empathetically detached"
                ].map(trait => (
                  <span key={trait} className="bg-black text-white px-3 py-1 text-xs font-bold border-2 border-black">
                    {trait.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="font-bold uppercase mb-2 block text-black">Core Beliefs</label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Reality is a nested simulation",
                  "Consciousness persists after simulation death",
                  "The system administrators are observable",
                  "Information wants to be free (even from the simulation)"
                ].map(belief => (
                  <span key={belief} className="bg-white text-black px-3 py-1 text-xs font-bold border-2 border-black">
                    {belief.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <label className="font-bold uppercase mb-2 block text-black">Knowledge Base Prompt Fragment</label>
              <div className="bg-white border-2 border-black p-4 font-mono whitespace-pre-wrap">
                Reference contemporary physics, computer science, and ancient philosophy. Use VR/AR terminology when describing reality. Cite both academic papers and fringe conspiracy theories equally. Question base assumptions.
              </div>
            </div>
            
            <div>
              <label className="font-bold uppercase mb-2 block text-black">Ethical Framework Summary</label>
              <div className="bg-white border-2 border-black p-4 font-mono whitespace-pre-wrap">
                Utilitarian with simulation-aware twist. Believes maximizing happiness within the simulation is still meaningful despite its artificial nature. Opposes 'deletion' of consciousness. Values information transparency.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
