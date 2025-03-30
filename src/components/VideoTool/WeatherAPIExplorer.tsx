
import React, { useState } from "react";

export const WeatherAPIExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("usageTab");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [location, setLocation] = useState<string>("New York,US");
  const [testResult, setTestResult] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonCode);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleTestFunction = () => {
    if (!apiKey.trim()) {
      setErrorMessage("Please enter an API key");
      return;
    }

    if (!location.trim()) {
      setErrorMessage("Please enter a location");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    // Simulate API call with delay
    setTimeout(() => {
      try {
        // Mock responses based on location
        const mockResponses: Record<string, string[]> = {
          "New York": ["Clear ☀️", "Cloudy ☁️", "Rain 🌧️"],
          "London": ["Cloudy ☁️", "Drizzle 🌦️", "Rain 🌧️"],
          "Tokyo": ["Clear ☀️", "Rain 🌧️", "Partly Cloudy ⛅"],
          "Sydney": ["Clear ☀️", "Windy 🌬️", "Thunderstorm ⚡"],
          "default": ["Clear ☀️", "Cloudy ☁️", "Windy 🌬️"],
        };

        // Find matching location or use default
        let locationKey = location.split(",")[0];
        let conditions =
          mockResponses[locationKey] || mockResponses.default;

        // Get random condition
        const condition =
          conditions[Math.floor(Math.random() * conditions.length)];

        // Display result
        setTestResult(
          `<strong>Weather in ${location}:</strong> <span class="weather-result">${condition}</span>`
        );
      } catch (error) {
        setTestResult("Error occurred during test");
        setErrorMessage(
          "Note: This is a simulated test. The real API call would be made using Python."
        );
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const openTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  const pythonCode = `import requests

def get_simplified_weather(api_key, location):
    """
    Get simplified weather description from OpenWeatherMap API.
    
    Args:
        api_key (str): OpenWeatherMap API key
        location (str): City name or "City,Country"
    
    Returns:
        str: Simplified weather condition (e.g., 'Clear', 'Rain', 'Clouds')
        
    Raises:
        ValueError: If API request fails or invalid data received
        requests.exceptions.RequestException: If network error occurs
    """
    base_url = "http://api.openweathermap.org/data/2.5/weather"
    
    try:
        # Make API request
        params = {
            'q': location,
            'appid': api_key,
            'units': 'metric'
        }
        response = requests.get(base_url, params=params)
        response.raise_for_status()  # Raise exception for 4XX/5XX status codes
        
        data = response.json()
        
        # Validate response structure
        if not isinstance(data.get('weather'), list) or len(data['weather']) == 0:
            raise ValueError("Invalid weather data format received")
            
        # Extract main weather condition
        weather_condition = data['weather'][0]['main']
        
        # Handle some special conditions
        if weather_condition == 'Thunderstorm':
            return 'Thunderstorm ⚡'
        elif 'rain' in weather_condition.lower():
            return 'Rain 🌧️'
        elif weather_condition == 'Drizzle':
            return 'Drizzle 🌦️'
        elif 'snow' in weather_condition.lower():
            return 'Snow ❄️'
        elif weather_condition == 'Clear':
            return 'Clear ☀️'
        elif weather_condition == 'Clouds':
            # Check if it's few clouds or overcast
            if data['weather'][0]['description'].lower() == 'few clouds':
                return 'Partly Cloudy ⛅'
            return 'Cloudy ☁️'
        elif 'wind' in weather_condition.lower():
            return 'Windy 🌬️'
        else:
            return weather_condition
        
    except requests.exceptions.RequestException as e:
        raise ValueError(f"Failed to fetch weather data: {str(e)}")
    except ValueError as e:
        raise
    except Exception as e:
        raise ValueError(f"Unexpected error processing weather data: {str(e)}")`;

  return (
    <div className="mt-12">
      <header className="mb-8">
        <h1 className="brutalist-header">WEATHER API EXPLORER</h1>
        <p className="text-center uppercase text-secondary">
          PYTHON IMPLEMENTATION FOR OPENWEATHERMAP API
        </p>
      </header>

      <div className="brutalist-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="brutalist-title flex items-center gap-2">
            <span>FUNCTION IMPLEMENTATION</span>
          </h2>
          <button
            className="brutalist-btn mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2"
            onClick={handleCopyCode}
          >
            {isCopied ? "COPIED!" : "COPY CODE"}
          </button>
        </div>

        <pre className="bg-black text-white p-4 overflow-x-auto font-mono text-sm max-h-[500px] overflow-y-auto">
          {pythonCode}
        </pre>
      </div>

      <div className="brutalist-card mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="brutalist-title">TRY IT OUT</h2>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">API KEY</label>
          <input
            type="text"
            className="brutalist-input"
            placeholder="Your OpenWeatherMap API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block font-bold mb-2">LOCATION</label>
          <input
            type="text"
            className="brutalist-input"
            placeholder="City name or 'City,Country' (e.g., 'London,UK')"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button
          className="brutalist-btn w-full mb-6"
          onClick={handleTestFunction}
          disabled={isLoading}
        >
          {isLoading ? "TESTING..." : "TEST FUNCTION"}
        </button>

        <div className="bg-gray-100 p-4 border-2 border-black">
          {testResult ? (
            <div
              className="font-mono"
              dangerouslySetInnerHTML={{ __html: testResult }}
            />
          ) : (
            <div className="font-mono">Results will appear here...</div>
          )}
          {errorMessage && (
            <div className="text-red-500 mt-2 font-bold">{errorMessage}</div>
          )}
        </div>
      </div>

      <div className="brutalist-card mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-2 border-black">
          <h2 className="brutalist-title">DOCUMENTATION</h2>
        </div>

        <div className="mb-6 border-b-2 border-black pb-2">
          <button
            className={`mr-4 py-2 px-4 ${
              activeTab === "usageTab"
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => openTab("usageTab")}
          >
            USAGE
          </button>
          <button
            className={`mr-4 py-2 px-4 ${
              activeTab === "paramsTab"
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => openTab("paramsTab")}
          >
            PARAMETERS
          </button>
          <button
            className={`mr-4 py-2 px-4 ${
              activeTab === "returnsTab"
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => openTab("returnsTab")}
          >
            RETURNS
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "errorsTab"
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => openTab("errorsTab")}
          >
            ERROR HANDLING
          </button>
        </div>

        {activeTab === "usageTab" && (
          <div>
            <h3 className="font-bold text-lg mb-2">Basic Usage Example</h3>
            <pre className="bg-gray-100 p-3 rounded mb-4 font-mono text-sm">
              {`# Import the function
from weather_utils import get_simplified_weather

# Call with your API key and location
try:
    condition = get_simplified_weather("your_api_key", "London,UK")
    print(f"Current weather: {condition}")
except ValueError as e:
    print(f"Error: {e}")`}
            </pre>
            <p>
              This function provides a simplified interface to the OpenWeatherMap
              API, returning just the most relevant weather condition with emoji
              decoration.
            </p>
          </div>
        )}

        {activeTab === "paramsTab" && (
          <div>
            <h3 className="font-bold text-lg mb-2">Parameters</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>
                <strong>api_key</strong> (str) - Your OpenWeatherMap API key
                (required)
              </li>
              <li>
                <strong>location</strong> (str) - City name or "City,Country"
                format (required)
              </li>
            </ul>
            <p>
              You can get a free API key by signing up at{" "}
              <a
                href="https://openweathermap.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                openweathermap.org
              </a>
              .
            </p>
          </div>
        )}

        {activeTab === "returnsTab" && (
          <div>
            <h3 className="font-bold text-lg mb-2">Return Values</h3>
            <p className="mb-2">
              The function returns a plain text string representing the current
              weather condition. Common returns include:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <ul className="list-disc pl-5">
                <li>'Clear ☀️'</li>
                <li>'Rain 🌧️'</li>
                <li>'Snow ❄️'</li>
                <li>'Cloudy ☁️'</li>
              </ul>
              <ul className="list-disc pl-5">
                <li>'Partly Cloudy ⛅'</li>
                <li>'Thunderstorm ⚡'</li>
                <li>'Drizzle 🌦️'</li>
                <li>'Windy 🌬️'</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "errorsTab" && (
          <div>
            <h3 className="font-bold text-lg mb-2">Error Handling</h3>
            <p className="mb-2">The function may raise these exceptions:</p>
            <ul className="list-disc pl-5 mb-4">
              <li>
                <strong>ValueError</strong> - For invalid API responses or
                missing data
              </li>
              <li>
                <strong>requests.exceptions.RequestException</strong> - For
                network/connection errors
              </li>
            </ul>
            <p>
              Always call the function within a try-except block to handle
              potential errors gracefully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
