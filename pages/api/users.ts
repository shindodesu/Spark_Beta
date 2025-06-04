// pages/api/users.ts
import { createClient } from '@supabase/supabase-js';

type User = {
  id: number;
  name: string;
  email: string;
};

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching users from Supabase...');
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email');

      if (error) {
        console.error('Error fetching data:', error);
        throw new Error(error.message);
      }

      res.status(200).json(data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
