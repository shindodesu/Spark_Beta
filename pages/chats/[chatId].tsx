// pages/chats/[chatId].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { supabase } from "../../lib/supabaseClient";

type Message = supabase['public']['Tables']['messages']['Row']
type Profile = supabase['public']['Tables']['profiles']['Row']

export default function ChatPage() {
  const supabase = createClientComponentClient<supabase>()
  const router = useRouter()
  const { chatId } = router.query

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [otherUser, setOtherUser] = useState<Profile | null>(null)

  useEffect(() => {
    if (!chatId || typeof chatId !== 'string') return

    const fetchInitialData = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      const uid = session?.user.id
      setUserId(uid)

      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select(`
          *,
          user1:profiles!chats_user1_id_fkey(*),
          user2:profiles!chats_user2_id_fkey(*)
        `)
        .eq('id', chatId)
        .single()

      if (chatError) {
        console.error('チャット取得エラー:', chatError)
        return
      }

      const other =
        chatData.user1_id === uid ? chatData.user2 : chatData.user1
      setOtherUser(other)

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (messagesError) {
        console.error('メッセージ取得エラー:', messagesError)
        return
      }

      setMessages(messagesData)
    }

    fetchInitialData()

    const channel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => [...prev, newMsg])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId])

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) return

    const { error } = await supabase.from('messages').insert({
      chat_id: chatId,
      sender_id: userId,
      content: newMessage
    })

    if (error) {
      console.error('送信エラー:', error)
    } else {
      setNewMessage('')
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>チャット相手: {otherUser?.username ?? 'ユーザー名なし'}</h1>
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ textAlign: msg.sender_id === userId ? 'right' : 'left' }}>
            <p style={{ background: '#eee', padding: '0.5rem', borderRadius: '6px', display: 'inline-block' }}>
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="メッセージを入力"
          style={{ flexGrow: 1, padding: '0.5rem' }}
        />
        <button onClick={sendMessage} style={{ padding: '0.5rem' }}>
          送信
        </button>
      </div>
    </div>
  )
}
