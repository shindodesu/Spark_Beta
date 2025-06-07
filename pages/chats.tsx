// pages/chats.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createBrowserSupabaseClient } from '@supabase/ssr';
import { supabase } from "../../lib/supabaseClient";
import type { Database } from '../../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Chat = Database['public']['Tables']['chats']['Row'];

export default function ChatListPage() {
  const supabase = createClientComponentClient<Database>();
  const [userId, setUserId] = useState<string | null>(null)
  const [chats, setChats] = useState<(Chat & { other_user: Profile })[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchChats = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      const uid = session?.user.id
      setUserId(uid)

      if (!uid) return

      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          user1:profiles!chats_user1_id_fkey(*),
          user2:profiles!chats_user2_id_fkey(*)
        `)
        .or(`user1_id.eq.${uid},user2_id.eq.${uid}`)

      if (error) {
        console.error('Error fetching chats:', error)
        return
      }

      const formatted = data.map((chat) => {
        const other_user = chat.user1_id === uid ? chat.user2 : chat.user1
        return {
          ...chat,
          other_user
        }
      })

      setChats(formatted)
    }

    fetchChats()
  }, [])

  return (
    <div style={{ padding: '1rem' }}>
      <h1>チャット一覧</h1>
      {chats.length === 0 ? (
        <p>チャットが存在しません。</p>
      ) : (
        <ul>
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                onClick={() => router.push(`/chats/${chat.id}`)}
                style={{
                  padding: '0.5rem',
                  margin: '0.5rem 0',
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {chat.other_user?.username ?? 'ユーザー名なし'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
