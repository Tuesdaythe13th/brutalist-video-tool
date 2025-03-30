
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://grrejinocympspxqghnu.supabase.co';
// Use the anon key directly since this is a browser environment
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycmVqaW5vY3ltcHNweHFnaG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNzMyNTEsImV4cCI6MjA1ODk0OTI1MX0.Dq9Mhe6tmZAk7KzYrfH8_GNvz_jvlSZo4uzC--ayLR0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
