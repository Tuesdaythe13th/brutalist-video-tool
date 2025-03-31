
import React, { useState } from "react";
import { ElevenLabsWidget } from "@/components/ElevenLabsWidget";

const Index = () => {
  const [ethicalScore, setEthicalScore] = useState(50);
  const [weatherState, setWeatherState] = useState("Clear ☀️");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Luigi Digital Twin Demo</h1>
      
      {/* Controls */}
      <div className="mb-8 space-y-4">
        <div className="space-y-2">
          <label htmlFor="ethical-score" className="text-sm font-medium">
            Ethical Score: {ethicalScore}
          </label>
          <input
            id="ethical-score"
            type="range"
            min="1"
            max="100"
            value={ethicalScore}
            onChange={(e) => setEthicalScore(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="weather-state" className="text-sm font-medium">
            Weather State:
          </label>
          <select
            id="weather-state"
            value={weatherState}
            onChange={(e) => setWeatherState(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Clear ☀️">Clear ☀️</option>
            <option value="Cloudy ☁️">Cloudy ☁️</option>
            <option value="Rain 🌧️">Rain 🌧️</option>
            <option value="Snow ❄️">Snow ❄️</option>
            <option value="Thunderstorm ⛈️">Thunderstorm ⛈️</option>
          </select>
        </div>
      </div>
      
      {/* ElevenLabs Widget */}
      <ElevenLabsWidget
        ethicalScore={ethicalScore}
        weatherState={weatherState}
      />
    </div>
  );
};

export default Index;
