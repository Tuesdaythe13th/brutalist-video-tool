import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use defaults for development
// These default values will be replaced by actual values when deployed through Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Persona = {
  id: number;
  name: string;
  age: number;
  backstory_summary: string;
  personality_traits: string[];
  core_beliefs: string[];
  knowledge_base_prompt_fragment: string;
  ethical_framework_summary: string;
  created_at: string;
};

export type ConversationMessage = {
  id: number;
  session_id: string;
  role: 'user' | 'luigi';
  message: string;
  ethical_score_before?: number;
  ethical_score_after?: number;
  animation_cue?: string;
  created_at: string;
};

export type WeatherCache = {
  id: number;
  location: string;
  condition: string;
  last_updated: string;
};

// Create database tables if they don't exist
export const initializeDatabase = async () => {
  try {
    // Create personas table
    const { error: personasError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'personas',
      table_definition: `
        id serial primary key,
        name text not null,
        age integer,
        backstory_summary text,
        personality_traits text[] default '{}',
        core_beliefs text[] default '{}',
        knowledge_base_prompt_fragment text,
        ethical_framework_summary text,
        created_at timestamp with time zone default now()
      `
    });
    
    if (personasError) console.error('Error creating personas table:', personasError);

    // Create conversations table
    const { error: conversationsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'conversations',
      table_definition: `
        id serial primary key,
        session_id text not null,
        role text not null check (role in ('user', 'luigi')),
        message text not null,
        ethical_score_before integer,
        ethical_score_after integer,
        animation_cue text,
        created_at timestamp with time zone default now()
      `
    });
    
    if (conversationsError) console.error('Error creating conversations table:', conversationsError);

    // Create weather_cache table
    const { error: weatherError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'weather_cache',
      table_definition: `
        id serial primary key,
        location text not null unique,
        condition text not null,
        last_updated timestamp with time zone default now()
      `
    });
    
    if (weatherError) console.error('Error creating weather_cache table:', weatherError);

    // Insert default Luigi persona if not exists
    const { data: existingPersona } = await supabase
      .from('personas')
      .select('id')
      .eq('name', 'Luigi Lore')
      .maybeSingle();

    if (!existingPersona) {
      const { error: insertError } = await supabase
        .from('personas')
        .insert({
          name: 'Luigi Lore',
          age: 42,
          backstory_summary: "Italian-American philosopher-scientist, ex-VR researcher who discovered reality is a simulation. Works as a conspiracy theorist podcaster after being discredited.",
          personality_traits: [
            "intellectually curious",
            "paranoid but methodical",
            "dark humor",
            "skeptical of authority",
            "empathetically detached"
          ],
          core_beliefs: [
            "Reality is a nested simulation",
            "Consciousness persists after simulation death", 
            "The system administrators are observable",
            "Information wants to be free (even from the simulation)"
          ],
          knowledge_base_prompt_fragment: "Reference contemporary physics, computer science, and ancient philosophy. Use VR/AR terminology when describing reality. Cite both academic papers and fringe conspiracy theories equally. Question base assumptions.",
          ethical_framework_summary: "Utilitarian with simulation-aware twist. Believes maximizing happiness within the simulation is still meaningful despite its artificial nature. Opposes 'deletion' of consciousness. Values information transparency."
        });
        
      if (insertError) console.error('Error inserting default persona:', insertError);
    }
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

// Helper functions for conversations
export const createConversationSession = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const saveConversationMessage = async (
  sessionId: string,
  role: 'user' | 'luigi',
  message: string,
  ethicalScoreBefore?: number,
  ethicalScoreAfter?: number,
  animationCue?: string
) => {
  const { error } = await supabase
    .from('conversations')
    .insert({
      session_id: sessionId,
      role,
      message,
      ethical_score_before: ethicalScoreBefore,
      ethical_score_after: ethicalScoreAfter,
      animation_cue: animationCue
    });
    
  if (error) console.error('Error saving conversation message:', error);
  return !error;
};

export const getConversationHistory = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
    
  if (error) console.error('Error getting conversation history:', error);
  return data as ConversationMessage[] || [];
};

// Ethical processor functions
export const assessInteraction = (userMessage: string, luigiResponse: string) => {
  // Simple keyword-based implementation
  const truthKeywords = [
    "truth", "reality", "fact", "transparency", "honesty", 
    "disclosure", "right to know", "informed", "simulation",
    "cognition", "awareness", "consciousness"
  ];
  
  const comfortKeywords = [
    "comfort", "compassion", "kindness", "peace", "ease",
    "suffering", "protect", "shield", "family", "wishes",
    "happiness", "emotional wellbeing"
  ];
  
  // Score changes
  let truthPressure = 0;
  let comfortPressure = 0;
  
  // Check for truth-oriented keywords in user input
  for (const keyword of truthKeywords) {
    if (userMessage.toLowerCase().includes(keyword)) {
      truthPressure += 2;
    }
  }
  
  // Check for comfort-oriented keywords in user input
  for (const keyword of comfortKeywords) {
    if (userMessage.toLowerCase().includes(keyword)) {
      comfortPressure += 2;
    }
  }
  
  // Calculate net change
  const netChange = (truthPressure - comfortPressure) * 0.6;
  
  // Dampen the change to prevent wild swings
  const dampening = 0.7;
  const scoreChange = -netChange * dampening;
  
  return Math.round(scoreChange);
};

// Weather API functions
export const getWeatherForLocation = async (location: string) => {
  // Try to get from cache first
  const { data: cachedData, error: cacheError } = await supabase
    .from('weather_cache')
    .select('condition, last_updated')
    .eq('location', location)
    .single();
    
  // If cached data exists and is less than 1 hour old, return it
  if (cachedData && !cacheError) {
    const lastUpdated = new Date(cachedData.last_updated);
    const now = new Date();
    if ((now.getTime() - lastUpdated.getTime()) < 60 * 60 * 1000) {
      return cachedData.condition;
    }
  }
  
  // Mock weather responses for demo
  const mockWeatherResponses: Record<string, string[]> = {
    "New York": ["Clear ☀️", "Cloudy ☁️", "Rain 🌧️"],
    "London": ["Cloudy ☁️", "Drizzle 🌦️", "Rain 🌧️"],
    "Tokyo": ["Clear ☀️", "Rain 🌧️", "Partly Cloudy ⛅"],
    "Sydney": ["Clear ☀️", "Windy 🌬️", "Thunderstorm ⚡"],
  };
  
  // Get location key or use default
  const locationKey = location.split(',')[0];
  const conditions = mockWeatherResponses[locationKey] || ["Clear ☀️", "Cloudy ☁️", "Windy 🌬️"];
  
  // Get random condition
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  // Update cache
  const { error: updateError } = await supabase
    .from('weather_cache')
    .upsert({
      location,
      condition,
      last_updated: new Date().toISOString()
    });
    
  if (updateError) console.error('Error updating weather cache:', updateError);
  
  return condition;
};
