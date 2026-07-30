import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

async function ensureTable(){
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT DEFAULT '',
      price NUMERIC NOT NULL DEFAULT 0,
      image_url TEXT DEFAULT '',
      description TEXT DEFAULT '',
      stock INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

function isAdmin(req){
  const key = req.headers['x-admin-key'];
  return key && process.env.ADMIN_KEY && key === process.env.ADMIN_KEY;
}

export default async function handler(req, res) {
  try{
    await ensureTable();
  }catch(e){
    res.status(500).json({ error: 'db init failed', detail: String(e) });
    return;
  }

  if (req.method === 'GET') {
    try{
      const { rows } = await sql`SELECT * FROM products ORDER BY created_at DESC`;
      res.status(200).json(rows);
    }catch(e){
      res.status(500).json({ error: 'read failed', detail: String(e) });
    }
    return;
  }

  if (req.method === 'POST') {
    if(!isAdmin(req)){ res.status(401).json({ error: 'unauthorized' }); return; }
    try{
      const { name, category, price, image_url, description, stock } = req.body || {};
      if(!name || price === undefined){ res.status(400).json({ error: 'name and price required' }); return; }
      const { rows } = await sql`
        INSERT INTO products (name, category, price, image_url, description, stock)
        VALUES (${name}, ${category || ''}, ${price}, ${image_url || ''}, ${description || ''}, ${stock || 0})
        RETURNING *;
      `;
      res.status(201).json(rows[0]);
    }catch(e){
      res.status(500).json({ error: 'create failed', detail: String(e) });
    }
    return;
  }

  if (req.method === 'PUT') {
    if(!isAdmin(req)){ res.status(401).json({ error: 'unauthorized' }); return; }
    try{
      const id = req.query.id;
      if(!id){ res.status(400).json({ error: 'id required' }); return; }
      const { name, category, price, image_url, description, stock } = req.body || {};
      const { rows } = await sql`
        UPDATE products SET
          name = COALESCE(${name}, name),
          category = COALESCE(${category}, category),
          price = COALESCE(${price}, price),
          image_url = COALESCE(${image_url}, image_url),
          description = COALESCE(${description}, description),
          stock = COALESCE(${stock}, stock)
        WHERE id = ${id}
        RETURNING *;
      `;
      if(rows.length === 0){ res.status(404).json({ error: 'not found' }); return; }
      res.status(200).json(rows[0]);
    }catch(e){
      res.status(500).json({ error: 'update failed', detail: String(e) });
    }
    return;
  }

  if (req.method === 'DELETE') {
    if(!isAdmin(req)){ res.status(401).json({ error: 'unauthorized' }); return; }
    try{
      const id = req.query.id;
      if(!id){ res.status(400).json({ error: 'id required' }); return; }
      await sql`DELETE FROM products WHERE id = ${id};`;
      res.status(200).json({ ok: true });
    }catch(e){
      res.status(500).json({ error: 'delete failed', detail: String(e) });
    }
    return;
  }

  res.status(405).json({ error: 'method not allowed' });
}
