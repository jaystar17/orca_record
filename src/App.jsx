import { useState } from "react";
import { Link } from "react-router-dom";
import hitters from "./data/players_hitter.json";
import pitchers from "./data/players_pitcher.json";
import profiles from "./data/players_profile.json";

function App() {
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const formatNumber = (val, digits = 2) => {
    if (val === undefined || val === null || val === "") return "-";
    return Number(val).toFixed(digits);
  };

  const formatInning = (val) => {
    if (!val && val !== 0) return "-";
    const whole = Math.floor(val);
    const decimal = val - whole;
    const fraction = decimal >= 0.66 ? "2/3" : decimal >= 0.33 ? "1/3" : "";
    return `${whole}${fraction ? ` ${fraction}` : ""}`;
  };

  const getCombinedStats = (name) => {
    const profile = profiles.find((p) => p.이름 === name);
    if (!profile) return null;
    const hitter = hitters[name]?.hitter?.career || {};
    const pitcher = pitchers[name]?.pitcher?.career || {};


    const war = (parseFloat(hitter.WAR || 0) + parseFloat(pitcher.WAR || 0)).toFixed(2);
    const ops =
      hitter.출루율 !== undefined && hitter.장타율 !== undefined
        ? (parseFloat(hitter.출루율) + parseFloat(hitter.장타율)).toFixed(3)
        : "-";

    return {
      이름: name,
      등번호: profile.등번호 || "-",
      포지션: profile.포지션 || "-",
      WAR: war,
      타율: hitter.타율 !== undefined ? Number(hitter.타율).toFixed(3) : "-",
      OPS: ops,
      홈런: hitter.홈런 !== undefined ? parseInt(hitter.홈런) : "-",
      타점: hitter.타점 !== undefined ? parseInt(hitter.타점) : "-",
      이닝: pitcher.이닝 !== undefined ? formatInning(pitcher.이닝) : "-",
      탈삼진: pitcher.삼진 !== undefined ? parseInt(pitcher.삼진) : "-",
      ERA: pitcher.ERA !== undefined ? Number(pitcher.ERA).toFixed(2) : "-",
      WHIP: pitcher.WHIP !== undefined ? Number(pitcher.WHIP).toFixed(2) : "-",
    };
  };

  const playerNames = profiles.map((p) => p.이름);
  const filtered =
    filter === "all"
      ? playerNames
      : playerNames.filter((name) => {
          if (filter === "hitter") return hitters[name]?.hitter;
          if (filter === "pitcher") return pitchers[name]?.pitcher;
          return false;
        });

  const sorted = [...filtered].sort((aName, bName) => {
    if (!sortKey) return 0;

    const aStat = getCombinedStats(aName);
    const bStat = getCombinedStats(bName);

    let aVal = aStat?.[sortKey];
    let bVal = bStat?.[sortKey];

    const parseInning = (str) => {
      if (typeof str === "string" && str.includes(" ")) {
        const [whole, frac] = str.split(" ");
        const base = parseInt(whole);
        const f = frac === "1/3" ? 1 / 3 : frac === "2/3" ? 2 / 3 : 0;
        return base + f;
      }
      return parseFloat(str);
    };

    const parseValue = (val, key) =>
      key === "이닝" ? parseInning(val) : parseFloat(val);

    const aNum = parseValue(aVal, sortKey);
    const bNum = parseValue(bVal, sortKey);

    const isInvalid = (v) => v === "-" || isNaN(v);

    if (isInvalid(aNum)) return 1;
    if (isInvalid(bNum)) return -1;

    return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
  });

  const headers = [
    { key: "이름", label: "이름", width: "w-[8%]" },
    { key: "등번호", label: "등번호", width: "w-[6%]" },
    { key: "포지션", label: "포지션", width: "w-[8%]" },
    { key: "WAR", label: "WAR", width: "w-[7%]" },
    { key: "타율", label: "타율", width: "w-[7%]" },
    { key: "OPS", label: "OPS", width: "w-[7%]" },
    { key: "홈런", label: "홈런", width: "w-[6%]" },
    { key: "타점", label: "타점", width: "w-[6%]" },
    { key: "이닝", label: "이닝", width: "w-[7%]" },
    { key: "탈삼진", label: "삼진", width: "w-[7%]" },
    { key: "ERA", label: "ERA", width: "w-[6%]" },
    { key: "WHIP", label: "WHIP", width: "w-[6%]" },
  ];

  return (
    <div className="p-4 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">ORCA 선수 기록 요약</h1>

      <div className="flex justify-center gap-2 mb-4">
        {[
          { type: "all", label: "전체" },
          { type: "hitter", label: "타자" },
          { type: "pitcher", label: "투수" },
        ].map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1 rounded border text-sm ${
              filter === type ? "bg-blue-600 text-white" : "bg-white text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1600px] table-fixed border text-sm text-center whitespace-nowrap border-collapse">
          <colgroup>
            {headers.map(({ width }) => (
              <col className={width} key={width} />
            ))}
          </colgroup>
          <thead className="bg-gray-100">
            <tr>
              {headers.map(({ key, label }) => (
                <th
                  key={key}
                  className={`cursor-pointer px-4 py-2`}
                  onClick={() => handleSort(key)}
                >
                  {label} {sortKey === key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((name, i) => {
              const stat = getCombinedStats(name);
              if (!stat) return null;
              return (
                <tr key={i} className="hover:bg-blue-50">
                  {headers.map(({ key }) => (
                    <td key={key} className={`px-4 py-2`}>
                      {key === "이름" ? (
                        <Link to={`/player/${stat.이름}`} className="text-blue-600 hover:underline">
                          {stat[key]}
                        </Link>
                      ) : (
                        stat[key]
                      )}
                    </td>
                  ))}
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