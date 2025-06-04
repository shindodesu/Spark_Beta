// pages/chats/new.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../../lib/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Chat = Database['public']['Tables']['chats']['Row']

export default function NewChatPage() {
  const supabase = createClientComponentClient<Database>()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user.id
      if (!uid) return

      setUserId(uid)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', uid)

      if (error) {
        console.error('プロフィール取得エラー:', error)
        return
      }

      setProfiles(data)
    }

    fetchProfiles()
  }, [])

  const startChat = async (partnerId: string) => {
    if (!userId) return

    // すでにチャットがあるか確認
    const { data: existingChats, error } = await supabase
      .from('chats')
      .select('*')
      .or(`and(user1_id.eq.${userId},user2_id.eq.${partnerId}),and(user1_id.eq.${partnerId},user2_id.eq.${userId})`)

    if (error) {
      console.error('チャット検索エラー:', error)
      return
    }

    if (existingChats && existingChats.length > 0) {
      // 既存チャットへ遷移
      router.push(`/chats/${existingChats[0].id}`)
      return
    }

    // なければ新規作成
    const { data: newChat, error: insertError } = await supabase
      .from('chats')
      .insert({
        user1_id: userId,
        user2_id: partnerId,
      })
      .select()
      .single()

    if (insertError || !newChat) {
      console.error('チャット作成エラー:', insertError)
      return
    }

    router.push(`/chats/${newChat.id}`)
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>新しいチャットを開始</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id} style={{ marginBottom: '1rem' }}>
            <strong>{profile.username ?? '名前なし'}</strong>
            <button onClick={() => startChat(profile.id)}>チャットする</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
