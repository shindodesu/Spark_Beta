// lib/supabaseClient.ts


import { createClient } from '@supabase/supabase-js';

// Supabase の URL とキーを設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


// supabase クライアントの作成
export const supabase  = createClient(supabaseUrl, supabaseKey);


console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);