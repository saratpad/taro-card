-- SiamSi Tarot Oracle — Core Supabase Postgres Schema
-- Tables: taro_codes, taro_deleted_codes, taro_rag_docs, taro_app_settings, taro_social_posts

create table if not exists public.taro_codes (
  code text primary key,
  fastwork_order text not null default '-',
  mode text not null default 'tarot' check (mode in ('tarot', 'siamsi', 'combo', 'palm')),
  locked_category text not null default '',
  created_at bigint not null,
  expires_at bigint not null,
  max_draws integer not null default 1 check (max_draws > 0),
  draw_count integer not null default 0 check (draw_count >= 0),
  tarot_draw_count integer not null default 0 check (tarot_draw_count >= 0),
  siamsi_draw_count integer not null default 0 check (siamsi_draw_count >= 0),
  palm_draw_count integer not null default 0 check (palm_draw_count >= 0),
  status text not null default 'unused' check (status in ('unused', 'accessed', 'drawn', 'expired')),
  logs jsonb not null default '{}'::jsonb,
  reading_result jsonb,
  tarot_result jsonb,
  siamsi_result jsonb,
  palm_result jsonb,
  events jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists taro_codes_created_at_idx
  on public.taro_codes (created_at desc);

create table if not exists public.taro_deleted_codes (
  code text primary key,
  deleted_at timestamptz not null default now()
);

create table if not exists public.taro_rag_docs (
  id text primary key,
  title text not null,
  source text not null default 'NotebookLM Upload',
  source_type text not null default 'NotebookLM Upload',
  style_tag text not null default '',
  description text not null default '',
  discipline text not null check (discipline in ('tarot', 'palm', 'siamsi')),
  target_scope text not null default 'tarot',
  enabled_for_viewer boolean not null default true,
  uploaded_at bigint not null,
  created_at bigint not null,
  chunks jsonb not null default '[]'::jsonb,
  chunks_count integer not null default 0 check (chunks_count >= 0),
  content text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists taro_rag_docs_created_idx
  on public.taro_rag_docs (created_at desc);

create table if not exists public.taro_app_settings (
  setting_key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.taro_social_posts (
  post_id text primary key,
  platform text not null,
  account text not null default '',
  privacy text not null default 'public',
  code text not null default '',
  mode text not null default 'tarot',
  share_url text not null default '',
  caption text not null default '',
  has_info_image boolean not null default true,
  verified boolean not null default true,
  device text not null default 'desktop',
  posted_at bigint not null,
  created_at timestamptz not null default now()
);

create index if not exists taro_social_posts_posted_at_idx
  on public.taro_social_posts (posted_at desc);

create index if not exists taro_social_posts_code_posted_idx
  on public.taro_social_posts (code, posted_at desc);

alter table public.taro_codes enable row level security;
alter table public.taro_deleted_codes enable row level security;
alter table public.taro_rag_docs enable row level security;
alter table public.taro_app_settings enable row level security;
alter table public.taro_social_posts enable row level security;

revoke all on table public.taro_codes from anon, authenticated;
revoke all on table public.taro_deleted_codes from anon, authenticated;
revoke all on table public.taro_rag_docs from anon, authenticated;
revoke all on table public.taro_app_settings from anon, authenticated;
revoke all on table public.taro_social_posts from anon, authenticated;
