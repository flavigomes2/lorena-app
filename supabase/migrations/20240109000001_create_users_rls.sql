-- Enable RLS
alter table public.users enable row level security;

-- Create policies
-- Allow users to read their own data
create policy "Users can view own data"
  on public.users
  for select
  using (auth.uid() = id);

-- Allow users to update their own data
create policy "Users can update own data"
  on public.users
  for update
  using (auth.uid() = id);

-- Allow the trigger function to insert new users
create policy "Allow trigger to create users"
  on public.users
  for insert
  with check (true);

-- Grant necessary permissions to authenticated users
grant usage on schema public to authenticated;
grant all on public.users to authenticated;

-- Grant necessary permissions to anon users (for initial signup)
grant usage on schema public to anon;
grant select on public.users to anon;
