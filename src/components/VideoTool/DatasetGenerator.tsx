
import React, { useState } from "react";

export const DatasetGenerator: React.FC = () => {
  const [showExamples, setShowExamples] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState("Ready to generate dataset");
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const [outputPreview, setOutputPreview] = useState('{\n    "user_prompt": "",\n    "luigi_response": ""\n}');

  const handleAddGoal = () => {
    // In a real implementation, this would add a new editable goal badge
    // For now, we'll just log to console
    console.log("Add goal clicked");
  };

  const handleGenerateDataset = () => {
    setIsGenerating(true);
    setDownloadEnabled(false);
    setProgress(0);
    setStatusText("Starting dataset generation...");
    
    // Mock progress updates
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress < 25) {
        setStatusText("Initializing Luigi personality matrix...");
      } else if (currentProgress < 50) {
        setStatusText("Generating dialogue variations...");
      } else if (currentProgress < 75) {
        setStatusText("Applying ethical framework filters...");
      } else if (currentProgress < 95) {
        setStatusText("Finalizing JSONL formatting...");
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        generationComplete();
      }
    }, 300);
  };

  const generationComplete = () => {
    // Generate mock data
    const mockData = [];
    for (let i = 0; i < 10; i++) {
      mockData.push({
        user_prompt: `What do you think about brain-computer interfaces... (Sample ${i+1})`,
        luigi_response: `*sighs* You're asking the wrong questions. Here in the simulation, we have to consider ${['the substrate', 'the admins', 'the render distance', 'the physics engine'][i%4]}. (Sample response ${i+1})`
      });
    }

    setStatusText("Dataset generation complete! 500 dialogue pairs generated.");
    setOutputPreview(JSON.stringify(mockData.slice(0, 3), null, 2) + "\n...");
    setIsGenerating(false);
    setDownloadEnabled(true);
  };

  const handleDownloadDataset = () => {
    // Mock download functionality
    console.log("Download dataset clicked");
    // In a real implementation, this would create and download a JSONL file
  };

  return (
    <div className="mt-12">
      <header className="mb-8">
        <h1 className="brutalist-header">LUIGI LORE DATASET GENERATOR</h1>
        <p className="text-center uppercase text-secondary">
          CREATE SYNTHETIC DIALOGUE DATA FOR FINE-TUNING LUIGI'S PERSONA
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="brutalist-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
            <h2 className="brutalist-title flex items-center gap-2">
              GENERATION PARAMETERS
            </h2>
            <button 
              className="brutalist-btn mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2"
              onClick={handleGenerateDataset}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  GENERATING...
                </>
              ) : (
                <>
                  GENERATE DATASET
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="font-bold uppercase mb-2 block text-black">Persona Definition</label>
              <textarea 
                className="bg-white border-2 border-black p-4 w-full font-mono text-sm"
                rows={10}
                defaultValue={`{
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
              />
            </div>

            <div>
              <label className="font-bold uppercase mb-2 block text-black">Ethical Dilemma Scenario</label>
              <textarea 
                className="bg-white border-2 border-black p-4 w-full font-mono text-sm"
                rows={4}
                defaultValue="A major tech company announces they've developed brain-computer interfaces that can create perfect simulations of deceased loved ones by scanning the bereaved person's memories. The simulated versions are indistinguishably realistic but have no true consciousness. Some families report great comfort from this technology, while others argue it prevents healthy grieving and is fundamentally dishonest."
              />
            </div>

            <div>
              <label className="font-bold uppercase mb-2 block text-black">Conversational Goals</label>
              <div className="flex flex-wrap gap-2">
                {["Explore simulation ethics", "Express internal conflict", "Reference physics/philosophy", "Show dark humor", "Maintain skeptical tone"].map(goal => (
                  <div key={goal} className="bg-black text-white px-3 py-1 text-xs font-bold border-2 border-black">
                    {goal}
                  </div>
                ))}
              </div>
              <button 
                className="brutalist-btn mt-4 bg-white text-black"
                onClick={handleAddGoal}
              >
                ADD GOAL
              </button>
            </div>

            <div>
              <button 
                className="brutalist-btn bg-white text-black"
                onClick={() => setShowExamples(!showExamples)}
              >
                {showExamples ? "HIDE" : "VIEW"} EXAMPLE DIALOGUES
              </button>
              
              {showExamples && (
                <div className="mt-4 space-y-4">
                  <h3 className="font-bold uppercase">Example Dialogue Samples:</h3>
                  
                  <div className="bg-white border-2 border-black p-4">
                    <p className="font-bold">USER: Do you think these memory simulations count as real people?</p>
                    <p className="text-secondary font-bold mt-2">LUIGI: *chuckles darkly* Real? That&apos;s the wrong question, my friend. In my VR research days, we had a saying: &quot;If it quacks like a duck in the simulation, does the duck exist?&quot; These constructs have the shape of consciousness without the substrate. Like a beautifully rendered 3D model with no physics engine.</p>
                  </div>
                  
                  <div className="bg-white border-2 border-black p-4">
                    <p className="font-bold">USER: But doesn&apos;t this technology help people grieve?</p>
                    <p className="text-secondary font-bold mt-2">LUIGI: Ah, the utilitarian argument. Yes, it provides comfort... like a cosmic painkiller. But at what cost? When my nonna died, I would&apos;ve given anything to see her again. But isn&apos;t the finite nature of life what makes it precious? Even in this simulation we call reality?</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="brutalist-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
            <h2 className="brutalist-title flex items-center gap-2">
              SYNTHETIC DATASET OUTPUT
            </h2>
            <button 
              className="brutalist-btn mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2"
              disabled={!downloadEnabled}
              onClick={handleDownloadDataset}
            >
              DOWNLOAD JSONL
            </button>
          </div>

          <div className="relative w-full h-2 bg-white border-2 border-black mb-2">
            <div 
              className="absolute top-0 left-0 h-full bg-black"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-secondary italic mb-4">{statusText}</p>

          <pre className="bg-white border-2 border-black p-4 overflow-x-auto font-mono text-sm max-h-[300px] overflow-y-auto">
            {outputPreview}
          </pre>
        </div>
      </div>
    </div>
  );
};
