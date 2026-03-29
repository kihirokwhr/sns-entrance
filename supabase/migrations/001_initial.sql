-- Users profile table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  display_name text not null,
  company text,
  role text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Chat rooms (1-on-1)
create table rooms (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references profiles(id) not null,
  user2_id uuid references profiles(id) not null,
  status text default 'active' check (status in ('active', 'handed_off', 'closed')),
  handed_off_to text, -- 'slack', 'linkedin', 'teams', 'wantedly', 'email'
  created_at timestamptz default now(),
  unique(user1_id, user2_id)
);

-- Messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) not null,
  sender_id uuid references profiles(id) not null,
  original_text text not null,   -- raw input (visible to sender only)
  filtered_text text not null,   -- AI-filtered output (visible to both)
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table rooms enable row level security;
alter table messages enable row level security;

-- profiles: public read, self write
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- rooms: only participants
create policy "Users can view own rooms"
  on rooms for select using (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "Users can create rooms"
  on rooms for insert with check (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "Users can update own rooms"
  on rooms for update using (auth.uid() = user1_id or auth.uid() = user2_id);

-- messages: only room participants
create policy "Users can view messages in own rooms"
  on messages for select using (
    room_id in (select id from rooms where user1_id = auth.uid() or user2_id = auth.uid())
  );
create policy "Users can insert messages in own rooms"
  on messages for insert with check (
    sender_id = auth.uid() and
    room_id in (select id from rooms where user1_id = auth.uid() or user2_id = auth.uid())
  );

-- Trigger to auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
