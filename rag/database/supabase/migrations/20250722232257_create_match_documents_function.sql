-- This function is from the Supabase vector search guide:
-- https://supabase.com/docs/guides/ai/vector-columns

create or replace function match_documents (
  query_embedding vector(768),
  match_threshold float
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    1 - (documents.embedding <#> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <#> query_embedding) > match_threshold
  order by similarity desc;
$$;
