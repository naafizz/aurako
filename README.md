# Aurako — E-commerce Website (Next.js + Supabase + Vercel)

সহজে ম্যানেজ করা যায় এমন একটা মিনিমাল, প্রিমিয়াম-লুকিং অনলাইন শপ। কাস্টমার নাম লিখে
(কাছাকাছি বানান হলেও) প্রোডাক্ট খুঁজে পাবে, কার্টে যোগ করবে, আর Cash on Delivery
ফর্ম পূরণ করে অর্ডার দিলে সেটা সরাসরি আপনার ডাটাবেজে চলে আসবে। প্রোডাক্ট যোগ করার
জন্য আছে একটা সহজ Admin ফর্ম।

## যা যা আছে

- 🔍 নাম লিখলেই (typo হলেও) লাইভ প্রোডাক্ট সাজেশন
- 🛒 কার্ট (ব্রাউজারে সেভ থাকে)
- 📦 Cash on Delivery চেকআউট ফর্ম → সরাসরি ডাটাবেজে সেভ হয়
- ➕ পাসকোড-প্রোটেক্টেড "Add Product" পেজ — কোনো কোড লাগবে না, শুধু ফর্ম পূরণ
- 🎨 মিনিমাল, প্রিমিয়াম ডিজাইন — মোবাইল ফ্রেন্ডলি

## ধাপ ১: Supabase সেটআপ (ফ্রি ডাটাবেজ)

1. [supabase.com](https://supabase.com) এ গিয়ে ফ্রি অ্যাকাউন্ট বানান, নতুন প্রজেক্ট তৈরি করুন
2. প্রজেক্ট খুলে বাম পাশের মেনু থেকে **SQL Editor** এ যান
3. এই রিপোর `supabase/schema.sql` ফাইলের পুরো কনটেন্ট কপি করে পেস্ট করুন, তারপর **Run** চাপুন
   — এতে `products` আর `orders` নামে দুইটা টেবিল তৈরি হয়ে যাবে
4. বাম মেনু থেকে **Project Settings > API** এ যান, এখান থেকে ৩টা জিনিস কপি করে রাখুন:
   - **Project URL**
   - **anon public key**
   - **service_role key** (⚠️ এটা গোপন রাখবেন, কখনো পাবলিকলি শেয়ার করবেন না)

## ধাপ ২: লোকাল সেটআপ

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` ফাইল খুলে Supabase থেকে কপি করা মানগুলো বসান, আর নিজের একটা
`ADMIN_PASSCODE` সেট করুন (এটা দিয়ে প্রোডাক্ট অ্যাড করবেন):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSCODE=আপনার-পাসকোড
```

লোকালি চালিয়ে দেখতে:

```bash
npm run dev
```

## ধাপ ৩: GitHub এ পুশ করুন

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## ধাপ ৪: Vercel এ ডিপ্লয়

1. [vercel.com](https://vercel.com) এ গিয়ে GitHub দিয়ে লগইন করুন
2. **Add New > Project** → আপনার GitHub রিপো সিলেক্ট করুন → **Import**
3. Deploy করার আগে **Environment Variables** সেকশনে গিয়ে `.env.local` এর
   ৪টা ভ্যারিয়েবলই যোগ করুন (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
   SUPABASE_SERVICE_ROLE_KEY, ADMIN_PASSCODE)
4. **Deploy** চাপুন — কিছুক্ষণের মধ্যেই আপনার সাইট লাইভ হয়ে যাবে একটা
   `your-project.vercel.app` ঠিকানায়

## প্রোডাক্ট যোগ করবেন কীভাবে

সাইট লাইভ হওয়ার পর যান: `your-project.vercel.app/admin/add-product`

সেখানে আপনার `ADMIN_PASSCODE`, প্রোডাক্টের নাম, দাম, ছবির লিংক (যেমন কোনো ইমেজ
হোস্টিং সাইট থেকে URL কপি করে), ক্যাটাগরি ও বিবরণ দিয়ে সাবমিট করলেই প্রোডাক্ট
সাথে সাথে হোমপেজে দেখা যাবে।

## অর্ডার কীভাবে পাবেন

কাস্টমার চেকআউট করলে অর্ডার সরাসরি Supabase এর `orders` টেবিলে সেভ হবে। দেখতে
হলে Supabase Dashboard > **Table Editor > orders** এ যান — নাম, ফোন নাম্বার,
ঠিকানা, কার্টের আইটেম সব দেখতে পাবেন।

## bKash/Nagad পেমেন্ট নিয়ে

এই ভার্সনে পেমেন্ট মেথড হলো **Cash on Delivery** — কাস্টমার প্রোডাক্ট হাতে পেয়ে
টাকা দেবে। bKash/Nagad এ সরাসরি অনলাইন পেমেন্ট নিতে চাইলে ভবিষ্যতে
**SSLCommerz** বা **aamarPay** (বাংলাদেশি পেমেন্ট গেটওয়ে) ইন্টিগ্রেট করা যাবে —
সেক্ষেত্রে চেকআউট ফর্মের পরের ধাপে পেমেন্ট গেটওয়ের পেজে রিডাইরেক্ট হবে।

## প্রোডাক্ট ছবি কোথা থেকে নেবেন

শুরুতে সহজ রাখতে ছবি একটা URL হিসেবে বসাতে হয়। কোনো ইমেজ হোস্টিং সার্ভিস
(যেমন imgbb.com, বা Supabase Storage) এ ছবি আপলোড করে সেই লিংক ব্যবহার করুন।
