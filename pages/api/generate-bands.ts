import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

type User = {
  id: string;
  name: string;
  part: string; // カンマ区切りのパート情報
};

type Band = {
  soprano?: User;
  alto?: User;
  tenor?: User;
  baritone?: User;
  bass?: User;
  vocalPercussion?: User;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ユーザー情報を取得
  const { data: users, error } = await supabase
    .from("users")
    .select("id, name, part");

  if (error) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }

  // パートごとにユーザーを分類
  const parts: Record<string, User[]> = {
    soprano: [],
    alto: [],
    tenor: [],
    baritone: [],
    bass: [],
    vocalPercussion: [],
  };

  const usedUserIds = new Set<string>(); // 重複防止用のセット

  users.forEach((user: User) => {
    const userParts = user.part.split(","); // カンマ区切りのパートを配列に変換
    userParts.forEach((part) => {
      const normalizedPart = part.trim().toLowerCase();
      if (parts[normalizedPart]) {
        parts[normalizedPart].push(user);
      }
    });
  });

  // バンド編成
  const bands: Band[] = [];
  while (true) {
    const band: Band = {};

    // 各パートにユーザーを割り当て
    for (const part of ["soprano", "alto", "tenor", "baritone", "bass", "vocalPercussion"]) {
      const availableUsers = parts[part].filter((user) => !usedUserIds.has(user.id));
      if (availableUsers.length > 0) {
        const user = availableUsers.pop(); // ユーザーを取得
        if (user) {
          band[part] = user;
          usedUserIds.add(user.id); // 使用済みとして記録
        }
      }
    }

    // バンドが不完全な場合は破棄
    if (Object.keys(band).length < 6) {
      break; // すべてのパートが埋まらない場合は終了
    }

    bands.push(band);
  }

  res.status(200).json({ bands });
}