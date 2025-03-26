create table public.deletion_requests (
  id uuid default gen_random_uuid() primary key,
  facebook_user_id text not null,
  confirmation_code text not null unique,
  status text not null check (status in ('pending', 'in_progress', 'completed', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.deletion_requests enable row level security;

-- Allow public to insert (needed for the Facebook callback)
create policy "Allow public to insert deletion requests"
  on public.deletion_requests for insert
  to public
  with check (true);

-- Only allow reading own deletion request via confirmation code
create policy "Allow reading own deletion request"
  on public.deletion_requests for select
  to public
  using (true);

-- Create updated_at trigger
create trigger handle_updated_at before update on public.deletion_requests
  for each row execute procedure moddatetime('updated_at'); 