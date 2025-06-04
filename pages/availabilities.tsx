import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AvailabilityPage = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]); // 複数の日付を管理
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("morning");
  const [locations, setLocations] = useState<string[]>([]); // 地域を配列で管理
  const session = useSession();
  const router = useRouter();

  const handleDateClick = (date: Date) => {
    setSelectedDates((prevDates) => {
      const exists = prevDates.some(
        (d) => d.toDateString() === date.toDateString()
      );
      if (exists) {
        // 既に選択されている場合は削除
        return prevDates.filter((d) => d.toDateString() !== date.toDateString());
      } else {
        // 新しく選択
        return [...prevDates, date];
      }
    });
  };

  const handleLocationChange = (location: string) => {
    setLocations((prevLocations) =>
      prevLocations.includes(location)
        ? prevLocations.filter((loc) => loc !== location) // チェックを外す
        : [...prevLocations, location] // チェックを追加
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = session?.user;

    if (!user) {
      alert("ログインしてください");
      return;
    }

    const formattedDates = selectedDates.map((date) =>
      date.toISOString().split("T")[0]
    );

    const { error } = await supabase.from("availabilities").insert({
      user_id: user.id,
      dates: formattedDates, // 複数の日付を保存
      time_slot: selectedTimeSlot,
      locations, // 選択された地域を保存
    });

    if (error) {
      console.error(error);
      alert("保存に失敗しました");
    } else {
      alert("登録しました！");
      router.push("/match");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>利用可能日程・場所を登録</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>日付:</label>
          <p className="text-sm text-gray-500 mb-2">
            カレンダーの日付をクリックして選択してください。もう一度クリックすると選択解除されます。
          </p>
          <Calendar
            onClickDay={handleDateClick} // 日付クリック時の処理
            tileClassName={({ date }) =>
              selectedDates.some(
                (d) => d.toDateString() === date.toDateString()
              )
                ? "selected"
                : ""
            } // 選択された日付にスタイルを適用
          />
        </div>
        <div>
          <label>時間帯:</label>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
          >
            <option value="morning">午前</option>
            <option value="afternoon">午後</option>
            <option value="evening">夜</option>
          </select>
        </div>
        <div>
          <label>場所・地域:</label>
          <p className="text-sm text-gray-500 mb-2">
            複数選択が可能です。選択したい地域をクリックしてください。
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
              "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
              "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
              "岐阜県", "静岡県", "愛知県", "三重県",
              "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
              "鳥取県", "島根県", "岡山県", "広島県", "山口県",
              "徳島県", "香川県", "愛媛県", "高知県",
              "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
            ].map((prefecture) => (
              <div key={prefecture} className="flex items-center">
                <input
                  type="checkbox"
                  id={prefecture}
                  value={prefecture}
                  checked={locations.includes(prefecture)}
                  onChange={() => handleLocationChange(prefecture)}
                  className="mr-2"
                />
                <label htmlFor={prefecture}>{prefecture}</label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit">登録する</button>
      </form>
      <style jsx>{`
        .selected {
          background-color: #90cdf4;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default AvailabilityPage;
