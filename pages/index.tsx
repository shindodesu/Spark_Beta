import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [bands, setBands] = useState<any[]>([]);

  const generateBands = async () => {
    setLoading(true);
    const response = await fetch("/api/generate-bands", {
      method: "POST",
    });
    const data = await response.json();
    setBands(data.bands || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200 to-white flex flex-col items-center justify-center px-4 py-12">
      <img
        src="/images/Spark_β_logo.png"
        alt="Spark β ロゴ"
        className="w-64 h-auto mb-6"
      />
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
        Sparkからその先へ
      </h1>
      <p className="text-lg text-gray-700 max-w-md text-center mb-8">
        アカペラをやりたい人同士が
        <br />
        日程と場所でつながる、
        <br />
        シャッフルバンドマッチングサービス。
      </p>
      <Link href="/ProfileForm">
        <span className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer">
          プロフィール入力へ
        </span>
      </Link>

      {/* バンド編成セクション */}
      <div className="mt-12 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">バンド編成</h2>
        <button
          onClick={generateBands}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "生成中..." : "バンドを生成"}
        </button>
        <div className="mt-6 space-y-4">
          {bands.length > 0 ? (
            bands.map((band, index) => (
              <div key={index} className="p-4 border rounded shadow">
                <h3 className="text-lg font-bold">バンド {index + 1}</h3>
                <ul className="mt-2 space-y-1">
                  {band.soprano && <li>Soprano: {band.soprano.name}</li>}
                  {band.alto && <li>Alto: {band.alto.name}</li>}
                  {band.tenor && <li>Tenor: {band.tenor.name}</li>}
                  {band.baritone && <li>Baritone: {band.baritone.name}</li>}
                  {band.bass && <li>Bass: {band.bass.name}</li>}
                  {band.vocalPercussion && (
                    <li>Vocal Percussion: {band.vocalPercussion.name}</li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            !loading && (
              <p className="text-gray-500 text-center">
                バンド候補が見つかりませんでした。
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

