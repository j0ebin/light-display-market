import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vhaizqhkodqyqplpqcss.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYWl6cWhrb2RxeXFwbHBxY3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMTU1NDAsImV4cCI6MjA1NzU5MTU0MH0.nbYlbIB6ckCdL3c96Z0gB-dmNHZuonPLAoGVTMStlWk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 