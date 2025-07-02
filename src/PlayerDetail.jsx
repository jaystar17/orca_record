import { useParams, useNavigate } from "react-router-dom";
import hitters from "./data/players_hitter.json";
import pitchers from "./data/players_pitcher.json";
import profiles from "./data/players_profile.json";

function PlayerDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const profile = profiles.find((p) => p.이름 === name);
  const hitter = hitters[name]?.hitter || {};
  const pitcher = pitchers[name]?.pitcher || {};

  const WAR = ((parseFloat(hitter?.career?.WAR || 0) + parseFloat(pitcher?.career?.WAR || 0)) || 0).toFixed(2);

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

  const seasons = ["career", "25", "24"];

  const hitterFields = [
    { key: "타석", label: "타석" },
    { key: "타수", label: "타수" },
    { key: "안타", label: "안타" },
    { key: "1루타", label: "1루타" },
    { key: "2루타", label: "2루타" },
    { key: "3루타", label: "3루타" },
    { key: "홈런", label: "홈런" },
    { key: "타점", label: "타점" },
    { key: "득점", label: "득점" },
    { key: "출루율", label: "출루율", digits: 3, float: true },
    { key: "장타율", label: "장타율", digits: 3, float: true },
    { key: "OPS", label: "OPS", digits: 3, float: true },
    { key: "wRC+", label: "wRC+", digits: 1, float: true },
    { key: "oWAR", label: "oWAR", digits: 2, float: true },
    { key: "dWAR", label: "dWAR", digits: 2, float: true },
    { key: "WAR", label: "WAR", digits: 2, float: true },
  ];

  const pitcherFields = [
    { key: "경기", label: "경기" },
    { key: "선발", label: "선발" },
    { key: "승", label: "승" },
    { key: "패", label: "패" },
    { key: "세", label: "세" },
    { key: "홀", label: "홀" },
    { key: "이닝", label: "이닝", format: formatInning },
    { key: "삼진", label: "삼진" },
    { key: "볼넷", label: "볼넷" },
    { key: "사구", label: "사구" },
    { key: "ERA", label: "ERA", digits: 2, float: true },
    { key: "FIP", label: "FIP", digits: 2, float: true },
    { key: "WHIP", label: "WHIP", digits: 2, float: true },
    { key: "K/9", label: "K/9", digits: 2, float: true },
    { key: "BB/9", label: "BB/9", digits: 2, float: true },
    { key: "K/BB", label: "K/BB", digits: 2, float: true },
    { key: "WAR", label: "WAR", digits: 2, float: true },
  ];

  const columnStyle = "w-[6%] px-2 py-1 border";

  return (
    <div className="p-6 max-w-[1600px] mx-auto bg-white shadow-lg rounded-xl">
      <button
        onClick={() => navigate("/")}
        className="text-blue-600 hover:underline text-sm mb-4"
      >
        ← 메인으로 돌아가기
      </button>

      <div className="bg-gradient-to-r from-blue-200 to-indigo-200 p-4 rounded-md mb-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {name} 선수 상세 기록
        </h2>
        <div className="flex justify-center gap-8 text-lg font-medium text-gray-700">
          <div>등번호: {profile?.등번호}</div>
          <div>포지션: {profile?.포지션}</div>
          <div className="font-semibold">통합 WAR: {WAR}</div>
        </div>
      </div>

      {Object.keys(hitter).length > 0 && (
        <div className="mb-8 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-2">🧢 타자 기록</h3>
          <table className="min-w-[1600px] w-full border-collapse text-sm text-center whitespace-nowrap overflow-x-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className={columnStyle}>시즌</th>
                {hitterFields.map((f) => (
                  <th key={f.key} className={columnStyle}>{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seasons.map((season, i) => {
                const row = hitter[season] || {};
                return (
                  <tr key={season} className={i === 0 ? "border-t-2 border-gray-300" : ""}>
                    <td className={columnStyle}>{season === "career" ? "누적" : season + "시즌"}</td>
                    {hitterFields.map((f) => {
                      const val = row[f.key];
                      const digits = f.digits || 0;
                      const ops =
                        f.key === "OPS" && row.출루율 && row.장타율
                          ? (parseFloat(row.출루율) + parseFloat(row.장타율)).toFixed(3)
                          : undefined;
                      return (
                        <td key={f.key} className={columnStyle}>
                          {f.key === "OPS"
                            ? ops
                            : f.float
                            ? format(val, digits, true)
                            : format(val)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {Object.keys(pitcher).length > 0 && (
        <div className="overflow-x-auto">
          <h3 className="text-xl font-semibold mb-2">⚾ 투수 기록</h3>
          <table className="min-w-[1600px] w-full border-collapse text-sm text-center whitespace-nowrap overflow-x-auto">
            <thead className="bg-blue-100">
              <tr>
                <th className={columnStyle}>시즌</th>
                {pitcherFields.map((f) => (
                  <th key={f.key} className={columnStyle}>{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seasons.map((season, i) => {
                const row = pitcher[season] || {};
                return (
                  <tr key={season} className={i === 0 ? "border-t-2 border-blue-300" : ""}>
                    <td className={columnStyle}>{season === "career" ? "누적" : season + "시즌"}</td>
                    {pitcherFields.map((f) => {
                      const val = row[f.key];
                      const digits = f.digits || 0;
                      if (f.format) return <td key={f.key} className={columnStyle}>{f.format(val)}</td>;
                      return (
                        <td key={f.key} className={columnStyle}>
                          {f.float ? format(val, digits, true) : format(val)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PlayerDetail;
