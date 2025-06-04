import { useEffect, useState } from 'react'
import Link from 'next/link'

const UserList = () => {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    // ここでAPIからユーザー一覧を取得
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
  }, [])

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {/* リンクでuserIdを渡す */}
            <Link href={`/edit/${user.id}`}>
              <a>Edit {user.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserList
