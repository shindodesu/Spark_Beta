import { useState } from "react";

type Band = {
  soprano?: { id: string; name: string };
  alto?: { id: string; name: string };
  tenor?: { id: string; name: string };
  baritone?: { id: string; name: string };
  bass?: { id: string; name: string };
  vocalPercussion?: { id: string; name: string };
};

export default function BandsPage() {
  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">バンド編成</h1>
      <button
        onClick={generateBands}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "生成中..." : "バンドを生成"}
      </button>
      <div className="mt-6 space-y-4">
        {bands.map((band, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold">バンド {index + 1}</h2>
            <ul className="mt-2 space-y-1">
              {band.soprano && <li>Soprano: {band.soprano.name}</li>}
              {band.alto && <li>Alto: {band.alto.name}</li>}
              {band.tenor && <li>Tenor: {band.tenor.name}</li>}
              {band.baritone && <li>Baritone: {band.baritone.name}</li>}
              {band.bass && <li>Bass: {band.bass.name}</li>}
              {band.vocalPercussion && <li>Vocal Percussion: {band.vocalPercussion.name}</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}