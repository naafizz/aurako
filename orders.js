import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

async function ensureTable(){
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_code TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      items JSONB NOT NULL,
      total NUMERIC NOT NULL,
      payment_method TEXT NOT NULL,
      transaction_id TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

function isAdmin(req){
  const key = req.headers['x-admin-key'];
  return key && process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;
}

function genOrderCode(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for(let i=0;i<6;i++) s += chars[Math.floor(Math.random()*chars.length)];
  return 'ARK-' + s;
}

export default async function handler(req, res) {
  try{
    await ensureTable();
  }catch(e){
    res.status(500).json({ error: 'db init failed', detail: String(e) });
    return;
  }

  if (req.method === 'POST') {
    try{
      const { customer_name, phone, address, items, total, payment_method, transaction_id } = req.body || {};
      if(!customer_name || !phone || !address || !Array.isArray(items) || items.length === 0 || !payment_method){
        res.status(400).json({ error: 'missing required fields' });
        return;
      }
      if((payment_method === 'bkash' || payment_method === 'nagad') && !transaction_id){
        res.status(400).json({ error: 'transaction_id required for online payment' });
        return;
      }
      let orderCode = genOrderCode();
      // retry a couple times on the unlikely unique-collision
      for(let attempt=0; attempt<3; attempt++){
        try{
          const { rows } = await sql`
            INSERT INTO orders (order_code, customer_name, phone, address, items, total, payment_method, transaction_id, status)
            VALUES (${orderCode}, ${customer_name}, ${phone}, ${address}, ${JSON.stringify(items)}, ${total}, ${payment_method}, ${transaction_id || ''}, 'pending')
            RETURNING order_code;
          `;
          res.status(201).json({ order_code: rows[0].order_code });
          return;
        }catch(e){
          if(String(e).includes('unique') && attempt < 2){ orderCode = genOrderCode(); continue; }
          throw e;
        }
      }
    }catch(e){
      res.status(500).json({ error: 'create failed', detail: String(e) });
    }
    return;
  }

  if (req.method === 'GET') {
    if(isAdmin(req)){
      try{
        const { rows } = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
        res.status(200).json(rows);
      }catch(e){
        res.status(500).json({ error: 'read failed', detail: String(e) });
      }
      return;
    }
    // public tracking: requires both order_code and phone to match
    const { code, phone } = req.query;
    if(!code || !phone){ res.status(400).json({ error: 'code and phone required' }); return; }
    try{
      const { rows } = await sql`
        SELECT order_code, customer_name, items, total, payment_method, status, created_at
        FROM orders WHERE order_code = ${code} AND phone = ${phone};
      `;
      if(rows.length === 0){ res.status(404).json({ error: 'not found' }); return; }
      res.status(200).json(rows[0]);
    }catch(e){
      res.status(500).json({ error: 'read failed', detail: String(e) });
    }
    return;
  }

  if (req.method === 'PATCH') {
    if(!isAdmin(req)){ res.status(401).json({ error: 'unauthorized' }); return; }
    try{
      const id = req.query.id;
      const { status } = req.body || {};
      const allowed = ['pending','confirmed','shipped','delivered','cancelled'];
      if(!id || !allowed.includes(status)){ res.status(400).json({ error: 'invalid id or status' }); return; }
      const { rows } = await sql`UPDATE orders SET status = ${status} WHERE id = ${id} RETURNING *;`;
      if(rows.length === 0){ res.status(404).json({ error: 'not found' }); return; }
      res.status(200).json(rows[0]);
    }catch(e){
      res.status(500).json({ error: 'update failed', detail: String(e) });
    }
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
}
