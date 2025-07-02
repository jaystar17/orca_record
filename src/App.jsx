import { useState } from "react";
import { useNavigate } from "react-router-dom";
import profiles from "./data/players_profile.json";
import hitters from "./data/players_hitter.json";
import pitchers from "./data/players_pitcher.json";

function App() {
  const [filter, setFilter] = useState("전체");
  const navigate = useNavigate();

  const format = (v, digits = 2, forceFloat = false) => {
    if (v === undefined || v === null || v === "") return "-";
    return forceFloat ? Number(v).toFixed(digits) : parseInt(v);
  };

  const formatInning = (val) => {
    if (!val && val !== 0) return "-";
    const whole = Math.floor(val);
    const decimal = val - whole;
    const fraction = decimal >= 0.66 ? "2/3" : decimal >= 0.33 ? "1/3" : "";
    return `${whole}${fraction ? ` ${fraction}` : ""}`;
  };

  const filteredProfiles = profiles.filter((p) => {
    if (filter === "전체") return true;
    if (filter === "타자") return hitters[p.이름];
    if (filter === "투수") return pitchers[p.이름];
  });

  const columnStyle =
    "px-4 py-3 border border-tableLine text-sm text-center font-mono";

  return (
    <div className="p-4 max-w-[1800px] mx-auto bg-background text-foreground font-sans">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary tracking-tight">
        ORCA 선수 기록 요약
      </h1>

      <div className="flex justify-center space-x-4 mb-6">
        {["전체", "타자", "투수"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded transition ${
              filter === t
                ? "bg-primary text-black font-bold shadow"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-[1600px] w-full table-fixed border border-tableLine text-sm text-center whitespace-nowrap">
          <thead className="bg-zinc-900 text-mint-400 font-semibold border-b border-tableLine sticky top-0 z-10">
            <tr>
              <th className={columnStyle}>이름</th>
              <th className={columnStyle}>등번호</th>
              <th className={columnStyle}>포지션</th>
              <th className={columnStyle}>WAR</th>
              <th className={columnStyle}>타율</th>
              <th className={columnStyle}>OPS</th>
              <th className={columnStyle}>홈런</th>
              <th className={columnStyle}>타점</th>
              <th className={columnStyle}>득점</th>
              <th className={columnStyle}>이닝</th>
              <th className={columnStyle}>삼진</th>
              <th className={columnStyle}>ERA</th>
              <th className={columnStyle}>WHIP</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.map((p) => {
              const hitter = hitters[p.이름]?.hitter?.career || {};
              const pitcher = pitchers[p.이름]?.pitcher?.career || {};
              const WAR = (
                parseFloat(hitter.WAR || 0) + parseFloat(pitcher.WAR || 0)
              ).toFixed(2);

              return (
                <tr
                  key={p.이름}
                  onClick={() => navigate(`/player/${p.이름}`)}
                  className="border-b border-tableLine hover:bg-zinc-800 transition cursor-pointer"
                >
                  <td className={columnStyle}>{p.이름}</td>
                  <td className={columnStyle}>{p.등번호}</td>
                  <td className={columnStyle}>{p.포지션}</td>
                  <td className={columnStyle}>{format(WAR, 2, true)}</td>
                  <td className={columnStyle}>{format(hitter.타율, 3, true)}</td>
                  <td className={columnStyle}>{format(hitter.OPS, 3, true)}</td>
                  <td className={columnStyle}>{format(hitter.홈런)}</td>
                  <td className={columnStyle}>{format(hitter.타점)}</td>
                  <td className={columnStyle}>{format(hitter.득점)}</td>
                  <td className={columnStyle}>{formatInning(pitcher.이닝)}</td>
                  <td className={columnStyle}>{format(pitcher.삼진)}</td>
                  <td className={columnStyle}>{format(pitcher.ERA, 2, true)}</td>
                  <td className={columnStyle}>{format(pitcher.WHIP, 2, true)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;