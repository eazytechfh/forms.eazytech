alter table public.briefings_geral
  add column if not exists respostas jsonb not null default '{}'::jsonb;

alter table public.briefings_concessionarias
  add column if not exists respostas jsonb not null default '{}'::jsonb;
