-- Opportunities table schema for volunteering and job listings
create table public.opportunities (
  id bigserial not null,
  title text not null,
  description text null,
  type text not null, -- 'volunteer' or 'job'
  organization text null,
  location text null,
  format text null, -- 'remote', 'in-person', 'hybrid'
  commitment text null, -- e.g., 'part-time', 'full-time', 'one-time', 'ongoing'
  requirements text null,
  application_deadline text null,
  posted_date text null,
  compensation text null, -- for jobs: salary info; for volunteer: 'unpaid' or benefits
  raw_source_text text null,
  source_url text null,
  content_hash text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  tags text[] null,
  slug text not null,
  constraint opportunities_pkey primary key (id),
  constraint opportunities_content_hash_key unique (content_hash),
  constraint opportunities_slug_key unique (slug)
) TABLESPACE pg_default;

create index IF not exists idx_opportunities_type on public.opportunities using btree (type) TABLESPACE pg_default;

create index IF not exists idx_opportunities_organization on public.opportunities using btree (organization) TABLESPACE pg_default;

create index IF not exists idx_opportunities_hash on public.opportunities using btree (content_hash) TABLESPACE pg_default;

create index IF not exists idx_opportunities_slug on public.opportunities using btree (slug) TABLESPACE pg_default;

create index IF not exists idx_opportunities_posted_date on public.opportunities using btree (posted_date) TABLESPACE pg_default;
