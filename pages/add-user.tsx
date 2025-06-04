// pages/add-user.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function AddUserPage() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.from('users').insert([{ name }])
    if (error) {
      alert('追加に失敗しました: ' + error.message)
    } else {
      alert('追加成功！')
      router.push('/test') // 一覧に戻る
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ユーザー追加</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="名前を入力"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">追加</button>
      </form>
    </div>
  )
}
