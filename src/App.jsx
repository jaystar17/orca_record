import { useNavigate } from "react-router-dom";
import hitters from "./data/players_hitter.json";
import pitchers from "./data/players_pitcher.json";
import profiles from "./data/players_profile.json";

function App() {
  const navigate = useNavigate();

  const format = (v, digits = 2, forceFloat = false) => {
    if (v === undefined || v === null || v === "") return "-";
    if (isNaN(v)) return "-";
    return forceFloat ? Number(v).toFixed(digits) : parseInt(v);
  };

  const formatInning = (val) => {
    if (!val && val !== 0) return "-";
    const whole = Math.floor(val);
    const decimal = val - whole;
    const fraction = decimal >= 0.66 ? "2/3" : decimal >= 0.33 ? "1/3" : "";
    return `${whole}${fraction ? ` ${fraction}` : ""}`;
  };

  const players = profiles.map((profile) => {
    const name = profile.이름;
    const hitter = hitters[name]?.hitter?.career || {};
    const pitcher = pitchers[name]?.pitcher?.career || {};
    const war = (parseFloat(hitter?.WAR || 0) + parseFloat(pitcher?.WAR || 0)).toFixed(2);
    const avg = hitter?.타율 ? Number(hitter.타율).toFixed(3) : "-";
    const ops =
      hitter?.출루율 && hitter?.장타율
        ? (parseFloat(hitter.출루율) + parseFloat(hitter.장타율)).toFixed(3)
        : "-";
    const whip = pitcher?.WHIP ? Number(pitcher.WHIP).toFixed(2) : "-";

    return {
      name,
      number: profile.등번호,
      position: profile.포지션,
      war,
      avg,
      ops,
      hr: hitter.홈런 || 0,
      rbi: hitter.타점 || 0,
      ip: pitcher.이닝 ? formatInning(pitcher.이닝) : "-",
      so: pitcher.삼진 || "-",
      era: pitcher.ERA ? Number(pitcher.ERA).toFixed(2) : "-",
      whip,
    };
  });

  const headers = [
    "이름",
    "등번호",
    "포지션",
    "WAR",
    "타율",
    "OPS",
    "홈런",
    "타점",
    "이닝",
    "삼진",
    "ERA",
    "WHIP",
  ];

  return (
    <div className="p-4 max-w-[1600px] mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">ORCA 선수 기록 요약</h2>

      <div className="overflow-x-auto">
        <table className="min-w-[1600px] w-full table-fixed border border-collapse text-sm text-center whitespace-nowrap">
          <thead className="bg-gray-800 text-white font-semibold">
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="px-3 py-2 border-r border-gray-700 w-[8.3%]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.name}
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => navigate(`/player/${player.name}`)}
              >
                <td className="px-3 py-2 border-r border-gray-200">{player.name}</td>
                <td className="px-3 py-2 border-r border-gray-200">{player.number}</td>
                <td className="px-3 py-2 border-r border-gray-200">{player.position}</td>
                <td className="px-3 py-2 border-r border-gray-200">{player.war}</td>
                <td className="px-3 py-2 border-r border-gray-200">{player.avg}</td>
                <td className="px-3 py-2 border-r border-gray-200">{player.ops}</td>
                <td className="px-3 py-2 border-r border-gray-200">{player.hr}</td>
                <td className="px-3 py-2 border-r border-gray-200">{player.rbi}</td>
                <td className="px-3 py-2 border-r border-gray-200">{player.ip}</td>
                <td className="px-3 py-2 border-r border-gray-200">{player.so}</td>
                <td className="px-3 py-2 border-r border-gray-200">{player.era}</td>
                <td className="px-3 py-2 border-r border-gray-200">{player.whip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;