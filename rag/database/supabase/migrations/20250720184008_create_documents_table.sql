create extension if not exists vector;

create table documents (
  id bigserial primary key,
  created_at timestamptz default now() not null,
  kind text,
  name text,
  content text,
  embedding vector(1536)
);
