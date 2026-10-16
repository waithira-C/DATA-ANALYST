-- =============================================================================
-- DataLadder: initial schema
-- Postgres 15 / Supabase. Apply with `supabase db reset` (local) or `supabase db push`.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text check (display_name is null or char_length(display_name) <= 80),
  role          text not null default 'learner' check (role in ('learner', 'employer')),
  company       text check (company is null or char_length(company) <= 120),
  headline      text check (headline is null or char_length(headline) <= 200),
  is_public     boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Create a profile automatically whenever a user signs up.
-- Reads options.data passed to supabase.auth.signUp({ options: { data: { display_name, role } } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role text := new.raw_user_meta_data ->> 'role';
  v_name text := nullif(btrim(new.raw_user_meta_data ->> 'display_name'), '');
begin
  if v_role is null or v_role not in ('learner', 'employer') then
    v_role := 'learner';
  end if;

  insert into public.profiles (id, display_name, role)
  values (new.id, left(coalesce(v_name, split_part(coalesce(new.email, ''), '@', 1)), 80), v_role)
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- True when the current user is an employer. SECURITY DEFINER so it can be used
-- inside RLS policies of other tables without recursion issues.
create or replace function public.is_employer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'employer'
  );
$$;

-- -----------------------------------------------------------------------------
-- Learning progress
-- -----------------------------------------------------------------------------
create table public.progress (
  user_id       uuid not null references auth.users (id) on delete cascade,
  step_id       text not null,
  xp            integer not null default 0 check (xp >= 0),
  score         integer check (score is null or score >= 0),
  completed_at  timestamptz not null default now(),
  primary key (user_id, step_id)
);

create table public.achievements (
  user_id    uuid not null references auth.users (id) on delete cascade,
  badge_id   text not null,
  earned_at  timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table public.user_stats (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  xp           integer not null default 0 check (xp >= 0),
  streak       integer not null default 0 check (streak >= 0),
  last_active  date,
  updated_at   timestamptz not null default now()
);

create trigger user_stats_set_updated_at
  before update on public.user_stats
  for each row execute function public.set_updated_at();

create index user_stats_xp_idx on public.user_stats (xp desc);

-- Steps a learner must complete before a certificate can be issued.
-- Seed from the app content (see supabase/README.md). Left empty on purpose:
-- issue_certificate() refuses to issue anything while this table is empty.
create table public.required_steps (
  step_id text primary key
);

-- -----------------------------------------------------------------------------
-- Curated learning resources
-- -----------------------------------------------------------------------------
create table public.resources (
  id           text primary key,
  title        text not null,
  url          text not null,
  provider     text,
  type         text,
  cost         text,
  level        integer,
  skills       text[] not null default '{}',
  est_hours    numeric,
  summary      text,
  youtube_id   text,
  dead         boolean not null default false,
  verified_at  date
);

create index resources_skills_idx on public.resources using gin (skills);

-- -----------------------------------------------------------------------------
-- Aggregated job board (written only by the fetch-jobs function / service role)
-- -----------------------------------------------------------------------------
create table public.jobs (
  id                   bigserial primary key,
  source               text not null,
  external_id          text not null,
  title                text not null,
  company              text,
  company_logo         text,
  location             text,
  remote               boolean,
  url                  text,
  description_snippet  text,
  salary               text,
  tags                 text[] not null default '{}',
  seniority            text not null default 'unknown'
                         check (seniority in ('entry', 'mid', 'senior', 'unknown')),
  posted_at            timestamptz,
  fetched_at           timestamptz not null default now(),
  unique (source, external_id)
);

create index jobs_posted_at_idx on public.jobs (posted_at desc nulls last);
create index jobs_seniority_idx on public.jobs (seniority);

-- -----------------------------------------------------------------------------
-- Jobs posted directly by employers
-- -----------------------------------------------------------------------------
create table public.employer_jobs (
  id           uuid primary key default gen_random_uuid(),
  employer_id  uuid not null references public.profiles (id) on delete cascade,
  title        text not null check (char_length(title) between 2 and 160),
  company      text,
  location     text,
  remote       boolean not null default false,
  url          text,
  description  text check (description is null or char_length(description) <= 10000),
  salary       text,
  seniority    text not null default 'unknown'
                 check (seniority in ('entry', 'mid', 'senior', 'unknown')),
  status       text not null default 'open' check (status in ('open', 'closed')),
  created_at   timestamptz not null default now()
);

create index employer_jobs_employer_idx on public.employer_jobs (employer_id);
create index employer_jobs_open_idx on public.employer_jobs (created_at desc) where status = 'open';

-- -----------------------------------------------------------------------------
-- Final exam
-- -----------------------------------------------------------------------------
create table public.exam_questions (
  id       serial primary key,
  q        text not null,
  options  text[] not null check (cardinality(options) between 2 and 6),
  answer   integer not null,
  explain  text,
  skill    text,
  check (answer >= 0 and answer < cardinality(options))
);

-- The question set most recently handed to each user by get_exam().
-- submit_exam() grades against exactly this set, so learners can't cherry-pick.
create table public.exam_issues (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  question_ids  integer[] not null,
  issued_at     timestamptz not null default now()
);

create table public.exam_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  score       integer not null,
  total       integer not null,
  passed      boolean not null,
  created_at  timestamptz not null default now()
);

create index exam_attempts_user_idx on public.exam_attempts (user_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Capstone + certificates
-- -----------------------------------------------------------------------------
create table public.capstones (
  user_id        uuid primary key references auth.users (id) on delete cascade,
  title          text check (title is null or char_length(title) <= 200),
  repo_url       text check (repo_url is null or repo_url ~* '^https?://'),
  dashboard_url  text check (dashboard_url is null or dashboard_url ~* '^https?://'),
  summary        text check (summary is null or char_length(summary) <= 5000),
  submitted_at   timestamptz not null default now()
);

create table public.certificates (
  id            text primary key check (id ~ '^DL-[A-Z0-9]{4}-[A-Z0-9]{4}$'),
  user_id       uuid not null unique references auth.users (id) on delete cascade,
  full_name     text not null,
  issued_at     timestamptz not null default now(),
  exam_score    integer,
  capstone_url  text,
  revoked       boolean not null default false
);

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.profiles        enable row level security;
alter table public.progress        enable row level security;
alter table public.achievements    enable row level security;
alter table public.user_stats      enable row level security;
alter table public.required_steps  enable row level security;
alter table public.resources       enable row level security;
alter table public.jobs            enable row level security;
alter table public.employer_jobs   enable row level security;
alter table public.exam_questions  enable row level security;
alter table public.exam_issues     enable row level security;
alter table public.exam_attempts   enable row level security;
alter table public.capstones       enable row level security;
alter table public.certificates    enable row level security;

-- profiles ---------------------------------------------------------------------
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "profiles: read public" on public.profiles
  for select to anon, authenticated using (is_public);

create policy "profiles: update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- progress / achievements / user_stats / capstones: full CRUD on own rows ------
create policy "progress: own" on public.progress
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "achievements: own" on public.achievements
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "user_stats: own" on public.user_stats
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "capstones: own" on public.capstones
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- required_steps / resources / jobs: public read-only ---------------------------
create policy "required_steps: public read" on public.required_steps
  for select to anon, authenticated using (true);

create policy "resources: public read" on public.resources
  for select to anon, authenticated using (true);

create policy "jobs: public read" on public.jobs
  for select to anon, authenticated using (true);

-- employer_jobs ----------------------------------------------------------------
create policy "employer_jobs: public read open" on public.employer_jobs
  for select to anon, authenticated using (status = 'open');

create policy "employer_jobs: owner read all" on public.employer_jobs
  for select to authenticated using (employer_id = auth.uid());

create policy "employer_jobs: employer insert" on public.employer_jobs
  for insert to authenticated
  with check (employer_id = auth.uid() and public.is_employer());

create policy "employer_jobs: employer update" on public.employer_jobs
  for update to authenticated
  using (employer_id = auth.uid() and public.is_employer())
  with check (employer_id = auth.uid() and public.is_employer());

create policy "employer_jobs: employer delete" on public.employer_jobs
  for delete to authenticated
  using (employer_id = auth.uid() and public.is_employer());

-- exam_questions / exam_issues: no client policies at all (RLS denies everything).
-- exam_attempts: read own; inserts happen only inside submit_exam().
create policy "exam_attempts: read own" on public.exam_attempts
  for select to authenticated using (user_id = auth.uid());

-- certificates: anyone can read non-revoked certs; owners can read their own.
create policy "certificates: public read" on public.certificates
  for select to anon, authenticated using (not revoked);

create policy "certificates: read own" on public.certificates
  for select to authenticated using (user_id = auth.uid());

-- Defense in depth: strip table privileges clients never need.
revoke all on table public.exam_questions from anon, authenticated;
revoke all on table public.exam_issues    from anon, authenticated;
revoke all on sequence public.exam_questions_id_seq from anon, authenticated;
revoke insert, update, delete, truncate on table public.exam_attempts  from anon, authenticated;
revoke insert, update, delete, truncate on table public.certificates   from anon, authenticated;
revoke insert, update, delete, truncate on table public.jobs           from anon, authenticated;
revoke insert, update, delete, truncate on table public.resources      from anon, authenticated;
revoke insert, update, delete, truncate on table public.required_steps from anon, authenticated;
revoke insert, delete, truncate on table public.profiles from anon, authenticated;
revoke all on table public.progress, public.achievements, public.user_stats,
                    public.capstones from anon;
revoke insert, update, delete, truncate on table public.employer_jobs from anon;

-- =============================================================================
-- RPC functions
-- =============================================================================

-- get_exam(n): returns n random questions WITHOUT answers and records the set
-- so submit_exam() can grade it. Calling it again replaces the previous set.
create or replace function public.get_exam(n integer default 40)
returns table (id integer, q text, options text[], skill text)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_ids integer[];
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  n := least(greatest(coalesce(n, 40), 5), 100);

  select array_agg(x.id) into v_ids
  from (select eq.id from public.exam_questions eq order by random() limit n) x;

  if v_ids is null then
    raise exception 'No exam questions available' using errcode = 'P0002';
  end if;

  insert into public.exam_issues (user_id, question_ids, issued_at)
  values (v_uid, v_ids, now())
  on conflict (user_id) do update
    set question_ids = excluded.question_ids, issued_at = excluded.issued_at;

  return query
    select eq.id, eq.q, eq.options, eq.skill
    from unnest(v_ids) with ordinality as u(qid, ord)
    join public.exam_questions eq on eq.id = u.qid
    order by u.ord;
end;
$$;

-- submit_exam(answers): answers = {"<question_id>": chosenIndex, ...}
-- Grades against the set issued by get_exam() (unanswered = wrong), records an
-- attempt, returns {score, total, passed, percent}. Pass mark: 80 %.
-- Rate limit: 3 attempts per rolling 24 hours.
create or replace function public.submit_exam(answers jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid      uuid := auth.uid();
  v_issue    public.exam_issues%rowtype;
  v_recent   integer;
  v_total    integer;
  v_score    integer;
  v_passed   boolean;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  if answers is null or jsonb_typeof(answers) <> 'object' then
    raise exception 'answers must be a JSON object of {"question_id": chosen_index}'
      using errcode = '22023';
  end if;

  -- Serialize submissions per user so the rate limit can't be raced.
  perform pg_advisory_xact_lock(hashtextextended('submit_exam:' || v_uid::text, 0));

  select count(*) into v_recent
  from public.exam_attempts
  where user_id = v_uid and created_at > now() - interval '24 hours';

  if v_recent >= 3 then
    raise exception 'Attempt limit reached: max 3 exam attempts per 24 hours'
      using errcode = 'P0001', hint = 'Try again later.';
  end if;

  select * into v_issue from public.exam_issues where user_id = v_uid for update;

  if not found then
    raise exception 'No active exam. Call get_exam() first.' using errcode = 'P0002';
  end if;

  if v_issue.issued_at < now() - interval '3 hours' then
    delete from public.exam_issues where user_id = v_uid;
    raise exception 'Exam session expired. Call get_exam() to start again.' using errcode = 'P0001';
  end if;

  v_total := cardinality(v_issue.question_ids);

  select count(*) into v_score
  from unnest(v_issue.question_ids) as u(qid)
  join public.exam_questions eq on eq.id = u.qid
  where jsonb_typeof(answers -> (u.qid::text)) = 'number'
    and (answers ->> (u.qid::text)) ~ '^\d+$'
    and (answers ->> (u.qid::text))::integer = eq.answer;

  v_passed := v_total > 0 and v_score * 100 >= v_total * 80;

  insert into public.exam_attempts (user_id, score, total, passed)
  values (v_uid, v_score, v_total, v_passed);

  delete from public.exam_issues where user_id = v_uid;

  return jsonb_build_object(
    'score',   v_score,
    'total',   v_total,
    'passed',  v_passed,
    'percent', case when v_total > 0 then round(v_score * 100.0 / v_total) else 0 end
  );
end;
$$;

-- issue_certificate(full_name): idempotent. Requires all required_steps in
-- progress, a passed exam attempt and a capstone with a repo_url.
create or replace function public.issue_certificate(full_name text)
returns public.certificates
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_uid        uuid := auth.uid();
  v_cert       public.certificates%rowtype;
  v_name       text := btrim(regexp_replace(coalesce(full_name, ''), '\s+', ' ', 'g'));
  v_missing    integer;
  v_best       integer;
  v_repo       text;
  v_code       text;
  v_alphabet   constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- 32 chars, no 0/O/1/I
  v_bytes      bytea;
  i            integer;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('issue_certificate:' || v_uid::text, 0));

  -- Idempotent: hand back the existing certificate.
  select * into v_cert from public.certificates c where c.user_id = v_uid;
  if found then
    return v_cert;
  end if;

  if char_length(v_name) < 2 or char_length(v_name) > 120 then
    raise exception 'full_name must be 2-120 characters' using errcode = '22023';
  end if;

  if not exists (select 1 from public.required_steps) then
    raise exception 'Certificate requirements are not configured (required_steps is empty)'
      using errcode = 'P0001';
  end if;

  select count(*) into v_missing
  from public.required_steps rs
  where not exists (
    select 1 from public.progress p
    where p.user_id = v_uid and p.step_id = rs.step_id
  );

  if v_missing > 0 then
    raise exception 'Not eligible: % required step(s) not completed', v_missing
      using errcode = 'P0001';
  end if;

  select max(round(a.score * 100.0 / nullif(a.total, 0)))::integer into v_best
  from public.exam_attempts a
  where a.user_id = v_uid and a.passed;

  if v_best is null then
    raise exception 'Not eligible: final exam not passed' using errcode = 'P0001';
  end if;

  select nullif(btrim(c.repo_url), '') into v_repo
  from public.capstones c where c.user_id = v_uid;

  if v_repo is null then
    raise exception 'Not eligible: capstone with repo_url not submitted' using errcode = 'P0001';
  end if;

  -- Generate a unique DL-XXXX-XXXX code from cryptographically random bytes.
  loop
    v_bytes := uuid_send(gen_random_uuid());  -- bytes 0-5 and 10-15 are fully random
    v_code := 'DL-';
    for i in 0..7 loop
      v_code := v_code || substr(
        v_alphabet,
        (get_byte(v_bytes, case when i < 6 then i else i + 4 end) % 32) + 1,
        1);
      if i = 3 then
        v_code := v_code || '-';
      end if;
    end loop;
    exit when not exists (select 1 from public.certificates c where c.id = v_code);
  end loop;

  insert into public.certificates (id, user_id, full_name, exam_score, capstone_url)
  values (v_code, v_uid, v_name, v_best, v_repo)
  returning * into v_cert;

  return v_cert;
end;
$$;

-- leaderboard(limit): XP ranking of learners who made their profile public.
create or replace function public.leaderboard("limit" integer default 20)
returns table (display_name text, xp integer)
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(p.display_name, 'Anonymous') as display_name, s.xp
  from public.user_stats s
  join public.profiles p on p.id = s.user_id
  where p.is_public
  order by s.xp desc, s.updated_at asc
  limit least(greatest(coalesce($1, 20), 1), 100);
$$;

-- Function privileges: nothing executable by PUBLIC by default.
revoke execute on function public.set_updated_at()            from public, anon, authenticated;
revoke execute on function public.handle_new_user()           from public, anon, authenticated;
revoke execute on function public.is_employer()               from public, anon;
revoke execute on function public.get_exam(integer)           from public, anon;
revoke execute on function public.submit_exam(jsonb)          from public, anon;
revoke execute on function public.issue_certificate(text)     from public, anon;
revoke execute on function public.leaderboard(integer)        from public;

grant execute on function public.is_employer()            to authenticated;
grant execute on function public.get_exam(integer)        to authenticated;
grant execute on function public.submit_exam(jsonb)       to authenticated;
grant execute on function public.issue_certificate(text)  to authenticated;
grant execute on function public.leaderboard(integer)     to anon, authenticated;

-- =============================================================================
-- Scheduled jobs (pg_cron + pg_net). Skipped gracefully when unavailable.
--
-- The 6-hourly fetch reads two Vault secrets you create once per project:
--   select vault.create_secret('https://<ref>.supabase.co', 'project_url');
--   select vault.create_secret('<random string>',           'cron_secret');
-- and the fetch-jobs function must have the same CRON_SECRET set as a secret.
-- =============================================================================
do $do$
begin
  if not exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    raise notice 'pg_cron not available; skipping job schedules';
    return;
  end if;

  begin
    create extension if not exists pg_cron;
  exception when others then
    raise notice 'Could not enable pg_cron (%); skipping job schedules', sqlerrm;
    return;
  end;

  -- Daily prune of stale aggregated jobs (03:15 UTC).
  begin
    perform cron.schedule(
      'dataladder-prune-jobs',
      '15 3 * * *',
      $cmd$delete from public.jobs where coalesce(posted_at, fetched_at) < now() - interval '45 days'$cmd$
    );
  exception when others then
    raise notice 'Could not schedule prune job: %', sqlerrm;
  end;

  if not exists (select 1 from pg_available_extensions where name = 'pg_net') then
    raise notice 'pg_net not available; skipping fetch-jobs schedule';
    return;
  end if;

  begin
    create extension if not exists pg_net with schema extensions;
  exception when others then
    raise notice 'Could not enable pg_net (%); skipping fetch-jobs schedule', sqlerrm;
    return;
  end;

  -- Every 6 hours: call the fetch-jobs edge function.
  begin
    perform cron.schedule(
      'dataladder-fetch-jobs',
      '7 */6 * * *',
      $cmd$
      select net.http_post(
        url     := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
                   || '/functions/v1/fetch-jobs',
        headers := jsonb_build_object(
                     'Content-Type', 'application/json',
                     'x-cron-secret',
                     coalesce((select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret'), '')
                   ),
        body    := '{}'::jsonb,
        timeout_milliseconds := 120000
      ) as request_id
      $cmd$
    );
  exception when others then
    raise notice 'Could not schedule fetch-jobs: %', sqlerrm;
  end;
end;
$do$;
