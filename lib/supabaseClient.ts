// lib/supabaseClient.ts


import { createClient } from '@supabase/supabase-js';
import { Database } from './lib/database.types.ts'; // Replace with the path to your Supabase types


// Supabase の URL とキーを設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


// supabase クライアントの作成
export const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );


console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);
