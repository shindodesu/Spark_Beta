// pages/matches.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // パスはプロジェクト構成に応じて調整

type Availability = {
  user_id: string;
  date: string;
  time_slot: string;
  location: string;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const myUser = await supabase.auth.getUser();
      const myUserId = myUser.data.user?.id;

      if (!myUserId) {
        setLoading(false);
        return;
      }

      const { data: myAvailability } = await supabase
        .from('availabilities')
        .select('*')
        .eq('user_id', myUserId)
        .maybeSingle();

      if (!myAvailability) {
        setLoading(false);
        return;
      }

      const { date, time_slot, location } = myAvailability;

      const { data, error } = await supabase
        .from('availabilities')
        .select('*')
        .eq('date', date)
        .eq('time_slot', time_slot)
        .eq('location', location)
        .neq('user_id', myUserId);

      if (error) {
        console.error(error);
      } else {
        setMatches(data || []);
      }
      setLoading(false);
    };

    fetchMatches();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>マッチング候補</h1>
      {loading ? (
        <p>読み込み中...</p>
      ) : matches.length === 0 ? (
        <p>一致する人はいません。</p>
      ) : (
        <ul>
          {matches.map((m, idx) => (
            <li key={idx}>
              {m.date} / {m.time_slot} / {m.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
