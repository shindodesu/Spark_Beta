import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function ProfileForm() {
  const [name, setName] = useState(''); // あだ名
  const [real_name, setRealName] = useState(''); // 本名
  const [part, setPart] = useState<string[]>([]); // パート（複数選択）
  const [region, setRegion] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState(''); // 自己紹介
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('users')
        .select('name, real_name, part, region, experience_years, bio')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setName(profile.name || '');
        setRealName(profile.real_name || '');
        setPart(profile.part ? profile.part.split(',') : []); // カンマ区切りを配列に変換
        setRegion(profile.region || '');
        setExperience(profile.experience_years?.toString() || '');
        setBio(profile.bio || ''); // bioをセット
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('ログインが必要です');
      return;
    }

    const updates = {
      id: user.id,
      email: user.email, // Eメールを追加
      name,
      real_name,
      part: part.join(','), // 配列をカンマ区切り文字列に変換
      region,
      experience_years: Number(experience),
      bio, // bioを追加
    };

    const { data: existing, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id));
    } else {
      ({ error } = await supabase
        .from('users')
        .insert(updates));
    }

    if (error) {
      alert('保存に失敗しました');
      console.error('❌ Supabase error:', error);
    } else {
      router.push('/profile');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded-xl">
      <h1 className="text-xl font-bold mb-4">プロフィール入力</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">あだ名</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">本名</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={real_name}
            onChange={(e) => setRealName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">パート</label>
          <p className="text-sm text-gray-500 mb-2">
            複数選択が可能です。
          </p>
          <div className="space-y-2">
            {[
              'Soprano (高音域)',
              'Alto (中高音域)',
              'Tenor (中音域)',
              'Baritone (中低音域)',
              'Bass (低音域)',
              'Vocal_Percussion (リズム担当)'
            ].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={option}
                  value={option.split(' ')[0]} // カッコ書きを除いた値を使用
                  checked={part.includes(option.split(' ')[0])}
                  onChange={() => {
                    const value = option.split(' ')[0];
                    setPart((prev) =>
                      prev.includes(value)
                        ? prev.filter((p) => p !== value) // チェックを外す
                        : [...prev, value] // チェックを追加
                    );
                  }}
                  className="mr-2"
                />
                <label htmlFor={option} className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">地域</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          >
            <option value="" disabled>選択してください</option>
            {[
              '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
              '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
              '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
              '岐阜県', '静岡県', '愛知県', '三重県',
              '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
              '鳥取県', '島根県', '岡山県', '広島県', '山口県',
              '徳島県', '香川県', '愛媛県', '高知県',
              '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
            ].map((prefecture) => (
              <option key={prefecture} value={prefecture}>
                {prefecture}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">経験年数</label>
          <input
            type="number"
            min="0"
            max="50"
            className="w-full border px-3 py-2 rounded"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">自己紹介</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="自己紹介を入力してください"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          保存して次へ
        </button>
      </form>
    </div>
  );
}


