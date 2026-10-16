-- Role family for aggregated jobs, written by the fetch-jobs function
-- (inferRoleFamily() in functions/_shared/jobsources.mjs).
alter table public.jobs
  add column if not exists role_family text;

alter table public.jobs
  drop constraint if exists jobs_role_family_check;

alter table public.jobs
  add constraint jobs_role_family_check
  check (role_family is null or role_family in (
    'data-analyst', 'bi', 'product-analytics', 'business-analyst', 'analytics-engineering', 'other-analyst'
  ));

create index if not exists jobs_role_family_idx on public.jobs (role_family);
