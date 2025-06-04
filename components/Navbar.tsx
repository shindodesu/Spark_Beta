import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="w-full bg-white shadow fixed top-0 left-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-indigo-700 cursor-pointer">Spark β</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/profile">
            <span className="text-gray-700 hover:text-indigo-600 cursor-pointer">プロフィール</span>
          </Link>
          <Link href="/bands">
            <span className="text-gray-700 hover:text-indigo-600 cursor-pointer">バンド</span>
          </Link>
          

          {user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.email ?? 'ユーザー'}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link href="/login">
              <span className="text-sm bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 cursor-pointer">
                ログイン
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
