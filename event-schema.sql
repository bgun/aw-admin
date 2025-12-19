create table public.events (
  id bigserial not null,
  title text not null,
  description text null,
  event_date text null,
  event_time text null,
  end_date text null,
  location text null,
  address text null,
  city text null,
  state text null,
  country text null,
  postal_code text null,
  venue text null,
  format text null,
  cost text null,
  organizer text null,
  category text null,
  image_url text null,
  source_url text not null,
  content_hash text not null,
  scraped_at timestamp with time zone null default now(),
  created_at timestamp with time zone null default now(),
  tags text[] null,
  tag_categories jsonb null,
  slug text null,
  constraint events_pkey primary key (id),
  constraint events_content_hash_key unique (content_hash)
) TABLESPACE pg_default;

create index IF not exists idx_events_content_hash on public.events using btree (content_hash) TABLESPACE pg_default;

create index IF not exists idx_events_event_date on public.events using btree (event_date) TABLESPACE pg_default;

create index IF not exists idx_events_city on public.events using btree (city) TABLESPACE pg_default;
