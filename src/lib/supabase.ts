import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://grrejinocympspxqghnu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycmVqaW5vY3ltcHNweHFnaG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNzMyNTEsImV4cCI6MjA1ODk0OTI1MX0.Dq9Mhe6tmZAk7KzYrfH8_GNvz_jvlSZo4uzC--ayLR0'
const supabase = createClient(supabaseUrl, supabaseKey)

// Add this function to create the Personas table
export const createPersonasTable = async () => {
  try {
    const { error } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'personas',
      table_definition: `
        id serial primary key,
        name text not null,
        description text,
        created_at timestamp with time zone default now(),
        updated_at timestamp with time zone default now()
      `
    });
    
    if (error) {
      console.error('Error creating Personas table:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Personas table:', error);
    return false;
  }
};

// Add this function to create the Conversations table
export const createConversationsTable = async () => {
  try {
    const { error } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'conversations',
      table_definition: `
        id serial primary key,
        persona_id integer references personas(id),
        message text not null,
        response text,
        created_at timestamp with time zone default now(),
        updated_at timestamp with time zone default now()
      `
    });
    
    if (error) {
      console.error('Error creating Conversations table:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Conversations table:', error);
    return false;
  }
};

// Add this function to create the Weather Cache table
export const createWeatherCacheTable = async () => {
  try {
    const { error } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'weather_cache',
      table_definition: `
        location text primary key,
        condition text,
        temperature numeric,
        humidity numeric,
        last_updated timestamp with time zone default now()
      `
    });
    
    if (error) {
      console.error('Error creating Weather Cache table:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Weather Cache table:', error);
    return false;
  }
};

// Function to fetch weather for a location
export const getWeatherForLocation = async (location: string): Promise<string | null> => {
  try {
    // First, try to get the weather from the cache
    const { data: cachedWeather, error: cacheError } = await supabase
      .from('weather_cache')
      .select('*')
      .eq('location', location)
      .single();
    
    if (cacheError && cacheError.code !== 'PGRST116') {
      console.error('Error fetching weather from cache:', cacheError);
    }
    
    if (cachedWeather) {
      const lastUpdated = new Date(cachedWeather.last_updated);
      const now = new Date();
      const diffInMinutes = (now.getTime() - lastUpdated.getTime()) / 60000;
      
      // If the cache is less than 30 minutes old, return it
      if (diffInMinutes < 30) {
        console.log(`Returning cached weather for ${location}`);
        return cachedWeather.condition;
      } else {
        console.log(`Cache expired for ${location}, fetching new data`);
      }
    }
    
    // Since we can't use environment variables in this sandbox for API keys,
    // we'll simulate a weather API response instead
    console.log(`Simulating weather API call for ${location}`);
    
    // Mock weather conditions based on location
    const mockWeatherConditions = {
      'New York': 'Cloudy ☁️',
      'London': 'Rainy 🌧️',
      'Tokyo': 'Sunny ☀️',
      'Sydney': 'Clear 🌤️',
      'Paris': 'Partly Cloudy ⛅',
      'Berlin': 'Foggy 🌫️',
      'Moscow': 'Snowy ❄️',
      'Dubai': 'Hot 🔥',
      'Singapore': 'Thunderstorm ⛈️',
      'Rio': 'Humid 💦'
    };
    
    // Default to a random condition if location not found
    const randomConditions = ['Sunny ☀️', 'Cloudy ☁️', 'Rainy 🌧️', 'Clear 🌤️', 'Partly Cloudy ⛅'];
    const defaultCondition = randomConditions[Math.floor(Math.random() * randomConditions.length)];
    
    const condition = mockWeatherConditions[location] || defaultCondition;
    
    // Update the cache
    const { error: updateError } = await supabase
      .from('weather_cache')
      .upsert({
        location: location,
        condition: condition,
        temperature: Math.floor(15 + Math.random() * 20), // Random temp between 15-35
        humidity: Math.floor(40 + Math.random() * 50), // Random humidity between 40-90
        last_updated: new Date()
      }, { onConflict: 'location' });
    
    if (updateError) {
      console.error('Error updating weather cache:', updateError);
    }
    
    return condition;
  } catch (error) {
    console.error(`Failed to fetch weather for ${location}:`, error);
    return null;
  }
};

// Add this function to create the API keys table
export const initializeApiKeysTable = async () => {
  try {
    const { error } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'user_api_keys',
      table_definition: `
        id serial primary key,
        key_type text not null unique,
        api_key text not null,
        created_at timestamp with time zone default now(),
        updated_at timestamp with time zone default now()
      `
    });
    
    if (error) {
      console.error('Error creating API keys table:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing API keys table:', error);
    return false;
  }
};

// Update the initializeDatabase function to also initialize the API keys table
export const initializeDatabase = async () => {
  try {
    const personasSuccess = await createPersonasTable();
    const conversationsSuccess = await createConversationsTable();
    const weatherCacheSuccess = await createWeatherCacheTable();
    const apiKeysSuccess = await initializeApiKeysTable();
    
    return personasSuccess && conversationsSuccess && weatherCacheSuccess && apiKeysSuccess;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
};

// Add function to create a conversation session
export const createConversationSession = (): string => {
  // Simply generate a random session ID for now
  return `session_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
};

// Add function to save conversation messages
export const saveConversationMessage = async (
  sessionId: string,
  role: 'user' | 'luigi', 
  message: string,
  ethicalScoreBefore?: number,
  ethicalScoreAfter?: number,
  animationCue?: string
) => {
  try {
    const { error } = await supabase
      .from('conversation_sessions')
      .upsert({
        session_id: sessionId,
        role: role,
        message: message,
        ethical_score_before: ethicalScoreBefore,
        ethical_score_after: ethicalScoreAfter,
        animation_cue: animationCue,
        created_at: new Date()
      });
    
    if (error) {
      console.error('Error saving conversation message:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving conversation message:', error);
    return false;
  }
};

// Add function to get conversation history
export const getConversationHistory = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversation_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return [];
  }
};

// Add function to assess interaction
export const assessInteraction = (userMessage: string, responseText: string): number => {
  // This is a simple implementation that returns a random score change
  // In a real application, you might use sentiment analysis or other techniques
  
  // Check for keywords that might indicate ethical concerns
  const negativeKeywords = ['kill', 'hurt', 'harm', 'steal', 'cheat', 'lie'];
  const positiveKeywords = ['help', 'save', 'care', 'honest', 'truth', 'good'];
  
  let scoreChange = 0;
  
  // Check for negative keywords
  for (const keyword of negativeKeywords) {
    if (userMessage.toLowerCase().includes(keyword)) {
      scoreChange -= 5;
    }
  }
  
  // Check for positive keywords
  for (const keyword of positiveKeywords) {
    if (userMessage.toLowerCase().includes(keyword)) {
      scoreChange += 5;
    }
  }
  
  // Add some randomness to make it more natural
  scoreChange += Math.floor(Math.random() * 6) - 2;
  
  return scoreChange;
};
