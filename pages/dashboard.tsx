import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')  // 未ログインならログインページへ
      } else {
        setUser(session.user)
      }
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>
      {user && (
        <div>
          <p>ようこそ、{user.email} さん</p>
          <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            ログアウト
          </button>
        </div>
      )}
    </div>
  )
}

