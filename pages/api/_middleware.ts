import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // CORSヘッダーを設定
  res.headers.set('Access-Control-Allow-Origin', 'https://spark-beta-phi.vercel.app/');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200 });
  }

  return res;
}