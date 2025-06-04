// pages/chats/index.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../../lib/database.types'

type Chat = Database['public']['Tables']['chats']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export default function ChatListPage() {
  const supabase = createClientComponentClient<Database>()
  const [chats, setChats] = useState<(Chat & { user1: Profile; user2: Profile })[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchChats = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      const uid = session?.user.id
      if (!uid) return

      setUserId(uid)

      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          user1:profiles!chats_user1_id_fkey(*),
          user2:profiles!chats_user2_id_fkey(*)
        `)
        .or(`user1_id.eq.${uid},user2_id.eq.${uid}`)

      if (error) {
        console.error('チャット一覧取得エラー:', error)
        return
      }

      setChats(data)
    }

    fetchChats()
  }, [])

  return (
    <div style={{ padding: '1rem' }}>
      <h1>チャット一覧</h1>
      <ul>
        {chats.map((chat) => {
          const otherUser = chat.user1.id === userId ? chat.user2 : chat.user1
          return (
            <li key={chat.id} style={{ marginBottom: '1rem' }}>
              <div>
                <strong>{otherUser.username ?? '名前なし'}</strong>
              </div>
              <button onClick={() => router.push(`/chats/${chat.id}`)}>チャットを開く</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
