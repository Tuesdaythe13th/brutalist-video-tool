import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://grrejinocympspxqghnu.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
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
    
    // If not in cache or cache expired, fetch from the weather API (replace with your actual API call)
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (response.status !== 200) {
      console.error(`Failed to fetch weather for ${location}:`, data.message);
      return null;
    }
    
    const condition = data.weather[0].main;
    
    // Update the cache
    const { error: updateError } = await supabase
      .from('weather_cache')
      .upsert({
        location: location,
        condition: condition,
        temperature: data.main.temp,
        humidity: data.main.humidity,
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
