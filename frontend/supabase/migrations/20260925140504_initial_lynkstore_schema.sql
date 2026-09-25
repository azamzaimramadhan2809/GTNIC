create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  username text not null unique check (username = lower(username) and username ~ '^[a-z0-9][a-z0-9-]{2,29}$'),
  store_name text not null check (char_length(store_name) between 2 and 80),
  category text not null default 'Lainnya',
  bio text not null default '',
  logo_url text not null default '',
  whatsapp_number text not null default '',
  instagram_url text not null default '',
  maps_url text not null default '',
  theme_id text not null default 'emerald',
  theme_mode text not null default 'light' check (theme_mode in ('light', 'dark')),
  qris_image_url text,
  qris_account_name text,
  opening_hours text,
  address text,
  whatsapp_message text,
  bank_name text,
  bank_account_number text,
  bank_account_name text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  price bigint not null default 0 check (price >= 0),
  description text not null default '',
  image_url text not null default '',
  category text,
  is_available boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.analytics_events (
  id bigint generated always as identity primary key,
  store_id uuid not null references public.stores(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  event_type text not null check (event_type in ('store_view', 'product_view', 'checkout_click', 'link_click')),
  visitor_id text,
  referrer text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index products_store_id_idx on public.products(store_id);
create index analytics_events_store_created_idx on public.analytics_events(store_id, created_at desc);

create function private.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function private.set_updated_at();
create trigger stores_updated_at before update on public.stores
for each row execute function private.set_updated_at();
create trigger products_updated_at before update on public.products
for each row execute function private.set_updated_at();

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.analytics_events enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "stores_public_read" on public.stores for select to anon, authenticated
using (is_published or (select auth.uid()) = owner_id);
create policy "stores_owner_insert" on public.stores for insert to authenticated
with check ((select auth.uid()) = owner_id);
create policy "stores_owner_update" on public.stores for update to authenticated
using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "stores_owner_delete" on public.stores for delete to authenticated
using ((select auth.uid()) = owner_id);

create policy "products_public_read" on public.products for select to anon, authenticated
using (exists (
  select 1 from public.stores s
  where s.id = products.store_id and (s.is_published or s.owner_id = (select auth.uid()))
));
create policy "products_owner_insert" on public.products for insert to authenticated
with check (exists (select 1 from public.stores s where s.id = products.store_id and s.owner_id = (select auth.uid())));
create policy "products_owner_update" on public.products for update to authenticated
using (exists (select 1 from public.stores s where s.id = products.store_id and s.owner_id = (select auth.uid())))
with check (exists (select 1 from public.stores s where s.id = products.store_id and s.owner_id = (select auth.uid())));
create policy "products_owner_delete" on public.products for delete to authenticated
using (exists (select 1 from public.stores s where s.id = products.store_id and s.owner_id = (select auth.uid())));

create policy "analytics_owner_read" on public.analytics_events for select to authenticated
using (exists (select 1 from public.stores s where s.id = analytics_events.store_id and s.owner_id = (select auth.uid())));
create policy "analytics_public_insert" on public.analytics_events for insert to anon, authenticated
with check (exists (select 1 from public.stores s where s.id = analytics_events.store_id and s.is_published));

grant usage on schema public to anon, authenticated;
grant select on public.stores, public.products to anon;
grant select, insert, update, delete on public.profiles, public.stores, public.products to authenticated;
grant insert on public.analytics_events to anon, authenticated;
grant select on public.analytics_events to authenticated;
grant usage, select on sequence public.analytics_events_id_seq to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('store-assets', 'store-assets', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public;

create policy "store_assets_public_read" on storage.objects for select to anon, authenticated
using (bucket_id = 'store-assets');
create policy "store_assets_owner_insert" on storage.objects for insert to authenticated
with check (bucket_id = 'store-assets' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "store_assets_owner_update" on storage.objects for update to authenticated
using (bucket_id = 'store-assets' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'store-assets' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "store_assets_owner_delete" on storage.objects for delete to authenticated
using (bucket_id = 'store-assets' and (storage.foldername(name))[1] = (select auth.uid())::text);
