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
  [key: string]: User | undefined; // インデックスシグネチャを追加
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { data: users, error } = await supabase
    .from("users")
    .select("id, name, part");

  if (error) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }

  const parts: Record<string, User[]> = {
    soprano: [],
    alto: [],
    tenor: [],
    baritone: [],
    bass: [],
    vocalPercussion: [],
  };

  users.forEach((user: User) => {
    const userParts = user.part.split(",");
    userParts.forEach((part) => {
      const normalizedPart = part.trim().toLowerCase();
      if (parts[normalizedPart]) {
        parts[normalizedPart].push(user);
      }
    });
  });

  const bands: Band[] = [];
  while (
    parts.soprano.length ||
    parts.alto.length ||
    parts.tenor.length ||
    parts.baritone.length ||
    parts.bass.length ||
    parts.vocalPercussion.length
  ) {
    const band: Band = {};

    for (const part of ["soprano", "alto", "tenor", "baritone", "bass", "vocalPercussion"]) {
      const availableUsers = parts[part].filter((user) => !bands.some((b) => b[part] === user));
      if (availableUsers.length > 0) {
        const user = availableUsers.pop();
        if (user) {
          band[part] = user;
        }
      }
    }

    bands.push(band);
  }

  res.status(200).json({ bands });
}