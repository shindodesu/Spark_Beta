import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error(userError)
        alert('ログインが必要です')
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error(error)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [])

  if (loading) return <div className="p-4">読み込み中...</div>
  if (!profile) return <div className="p-4">プロフィールが見つかりません</div>

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded-xl">
      <h1 className="text-xl font-bold mb-6">プロフィール確認</h1>
      <div className="space-y-3 text-gray-800">
        <p><strong>あだ名：</strong>{profile.name}</p>
        <p><strong>本名：</strong>{profile.real_name}</p>
        <p><strong>パート：</strong>{profile.part}</p>
        <p><strong>地域：</strong>{profile.region}</p>
        <p><strong>経験年数：</strong>{profile.experience_years} 年</p>
        <p><strong>自己紹介：</strong>{profile.bio || '未入力'}</p>
      </div>

      <button
        onClick={() => router.push('/ProfileForm')}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
      >
        編集する
      </button>
    </div>
  )
}
