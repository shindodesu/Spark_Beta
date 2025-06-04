create extension if not exists "uuid-ossp";

create table Users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  real_name text,
  email text,
  part text,
  experience_years int,
  region text,
  bio text,
  created_at timestamp default now(),
  is_verified boolean default false
);

create table Availabilities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references Users(id),
  date date,
  time time,
  location text
);

create table Matches (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp default now(),
  status text,
  notes text
);

create table MatchMembers (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references Matches(id),
  user_id uuid references Users(id)
);

create table Penalties (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references Users(id),
  reason text,
  match_id uuid references Matches(id),
  timestamp timestamp default now()
);
