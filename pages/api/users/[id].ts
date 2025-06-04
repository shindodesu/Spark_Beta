// pages/api/users/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // OPTIONSリクエストに対するレスポンス
    return;
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, email } = req.body;

      const { data, error } = await supabase
        .from('users')
        .update({ name, email })
        .eq('id', id);

      if (error) {
        res.status(400).json({ error: 'Failed to update user' });
        return;
      }

      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}