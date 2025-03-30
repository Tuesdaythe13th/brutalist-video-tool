import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { getWeatherForLocation } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface WeatherAPIExplorerProps {
  onWeatherUpdate?: (location: string) => Promise<string | null>;
}

export const WeatherAPIExplorer: React.FC<WeatherAPIExplorerProps> = ({ onWeatherUpdate }) => {
  const [location, setLocation] = useState("New York");
  const [weatherCondition, setWeatherCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGetWeather = async () => {
    setIsLoading(true);

    try {
      let condition;
      
      if (onWeatherUpdate) {
        // Use the callback from props if provided
        condition = await onWeatherUpdate(location);
      } else {
        // Otherwise use direct function call
        condition = await getWeatherForLocation(location);
      }
      
      setWeatherCondition(condition || "Unknown");
      
      toast({
        title: "Weather Updated",
        description: `Current condition in ${location}: ${condition}`,
      });
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      toast({
        title: "Weather Update Failed",
        description: "Could not retrieve weather data. Check console for details.",
        variant: "destructive"
      });
      setWeatherCondition("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const pythonCode = `import requests
import json
from datetime import datetime, timedelta

class WeatherAPIClient:
    """Client for accessing weather data and caching results in Supabase."""
    
    def __init__(self, supabase_client):
        """
        Initialize the weather API client.
        
        Args:
            supabase_client: Initialized Supabase client
        """
        self.supabase = supabase_client
        self.cache_duration = timedelta(hours=1)  # Cache weather for 1 hour
        
    async def get_weather(self, location):
        """
        Get weather for a location, using cache when available.
        
        Args:
            location: String location name (e.g., "New York")
            
        Returns:
            String with weather condition and emoji
        """
        # Check cache first
        cached_weather = await self._get_from_cache(location)
        if cached_weather:
            return cached_weather
            
        # If not in cache or expired, fetch from API
        weather_data = await self._fetch_from_api(location)
        
        # Cache the result
        await self._update_cache(location, weather_data)
        
        return weather_data
        
    async def _get_from_cache(self, location):
        """Check if we have a recent cache entry for this location."""
        try:
            response = await self.supabase.table('weather_cache').select('*').eq('location', location).single()
            
            if response.data:
                last_updated = datetime.fromisoformat(response.data['last_updated'])
                if datetime.now() - last_updated < self.cache_duration:
                    return response.data['condition']
        except Exception as e:
            print(f"Cache retrieval error: {e}")
            
        return None
        
    async def _update_cache(self, location, condition):
        """Update the cache with new weather data."""
        try:
            await self.supabase.table('weather_cache').upsert({
                'location': location,
                'condition': condition,
                'last_updated': datetime.now().isoformat()
            })
        except Exception as e:
            print(f"Cache update error: {e}")
            
    async def _fetch_from_api(self, location):
        """
        Fetch weather from external API.
        
        In production, this would call a real weather API.
        For this demo, we'll simulate with mock data.
        """
        # Simulate API delay
        import asyncio
        await asyncio.sleep(0.5)
        
        # Mock weather responses
        mock_weather = {
            "New York": ["Clear ☀️", "Cloudy ☁️", "Rain 🌧️"],
            "London": ["Cloudy ☁️", "Drizzle 🌦️", "Rain 🌧️"],
            "Tokyo": ["Clear ☀️", "Rain 🌧️", "Partly Cloudy ⛅"],
            "Sydney": ["Clear ☀️", "Windy 🌬️", "Thunderstorm ⚡"],
        }
        
        # Get location key or use default
        location_key = location.split(',')[0]
        conditions = mock_weather.get(location_key, ["Clear ☀️", "Cloudy ☁️", "Windy 🌬️"])
        
        # Get random condition
        import random
        return random.choice(conditions)
        
    def get_supported_locations(self):
        """Return list of locations with good data coverage."""
        return ["New York", "London", "Tokyo", "Sydney", "Paris", "Berlin"]`;

  return (
    <div className="brutalist-card mt-6">
      <div className="card-header">
        <h2 className="brutalist-title">
          <i className="fas fa-cloud-sun mr-2"></i>
          WEATHER API EXPLORER
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="form-label mb-1">Location</label>
            <div className="flex">
              <input
                type="text"
                className="brutalist-input flex-grow"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location (e.g., New York)"
              />
              <Button 
                className="brutalist-btn ml-2"
                onClick={handleGetWeather}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-1"></i> Loading...
                  </>
                ) : (
                  <>Get Weather</>
                )}
              </Button>
            </div>
          </div>

          <div className="p-4 border-2 border-black mb-4">
            <h3 className="font-bold mb-2">Current Weather</h3>
            {weatherCondition ? (
              <div className="text-2xl font-bold">{weatherCondition}</div>
            ) : (
              <div className="text-gray-500">No weather data fetched yet</div>
            )}
          </div>

          <div className="p-4 border-2 border-black">
            <h3 className="font-bold mb-2">Supported Locations</h3>
            <div className="flex flex-wrap gap-2">
              {["New York", "London", "Tokyo", "Sydney", "Paris", "Berlin"].map((city) => (
                <button
                  key={city}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm"
                  onClick={() => setLocation(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Python Implementation</h3>
          <div className="bg-black text-gray-300 font-mono text-sm p-4 overflow-auto h-[400px]">
            {pythonCode}
          </div>
        </div>
      </div>
    </div>
  );
};
