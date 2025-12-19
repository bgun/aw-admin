import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Event = {
  id: number;
  title: string;
  description: string | null;
  event_date: string | null;
  event_time: string | null;
  end_date: string | null;
  location: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  venue: string | null;
  format: string | null;
  cost: string | null;
  organizer: string | null;
  category: string | null;
  image_url: string | null;
  source_url: string;
  content_hash: string;
  scraped_at: string | null;
  created_at: string | null;
  tags: string[] | null;
  tag_categories: Record<string, any> | null;
  slug: string | null;
}

export type Opportunity = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  organization: string | null;
  location: string | null;
  format: string | null;
  commitment: string | null;
  requirements: string | null;
  application_deadline: string | null;
  posted_date: string | null;
  compensation: string | null;
  raw_source_text: string | null;
  source_url: string | null;
  content_hash: string | null;
  created_at: string | null;
  updated_at: string | null;
  tags: string[] | null;
  slug: string;
}
