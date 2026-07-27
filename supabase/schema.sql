-- এই SQL Supabase Dashboard > SQL Editor এ পেস্ট করে "Run" চাপুন

create extension if not exists "uuid-ossp";

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price numeric not null,
  description text,
  image_url text,
  category text,
  stock integer default 0,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  phone text not null,
  address text not null,
  items jsonb not null,
  total numeric not null,
  note text,
  payment_method text default 'cash_on_delivery',
  status text default 'pending',
  created_at timestamptz default now()
);

-- Row Level Security চালু করা হচ্ছে
alter table products enable row level security;
alter table orders enable row level security;

-- সবাই প্রোডাক্ট দেখতে পারবে (কিন্তু insert/update/delete করতে পারবে না -
-- সেটা শুধু service role key দিয়ে সার্ভার থেকেই হবে)
create policy "Public can read products"
  on products for select
  using (true);

-- orders টেবিলে কোনো public policy নেই, তাই এটা শুধু service role
-- (আমাদের API route) থেকেই read/write করা যাবে - এটাই ইচ্ছাকৃত।
