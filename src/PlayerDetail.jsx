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

  const WAR = (
    (parseFloat(hitter?.career?.WAR || 0) + parseFloat(pitcher?.career?.WAR || 0)) || 0
  ).toFixed(2);

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

  const columnStyle = "min-w-[80px] px-3 py-2 border border-tableLine text-sm text-center";

  return (
    <div className="p-4 max-w-[1600px] mx-auto bg-background text-foreground font-sans">
      <button
        onClick={() => navigate("/")}
        className="text-primary hover:underline text-sm mb-4"
      >
        ← 메인으로 돌아가기
      </button>

      <h2 className="text-2xl font-bold text-center mb-4 text-primary">
        {name} 선수 상세 기록
      </h2>

      <div className="text-lg text-center mb-6 font-semibold text-primary">
        통합 WAR: {WAR}
      </div>

      {Object.keys(hitter).length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <table className="min-w-[1600px] w-full table-fixed border border-tableLine text-sm text-center whitespace-nowrap">
            <thead className="bg-tableLine text-primary font-semibold border-b border-tableLine">
              <tr>
                <th className={columnStyle}>시즌</th>
                {hitterFields.map((f) => (
                  <th key={f.key} className={columnStyle}>{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seasons.map((season) => {
                const row = hitter[season] || {};
                return (
                  <tr key={season} className="border-b border-tableLine hover:bg-zinc-900">
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
          <table className="min-w-[1600px] w-full table-fixed border border-tableLine text-sm text-center whitespace-nowrap">
            <thead className="bg-tableLine text-primary font-semibold border-b border-tableLine">
              <tr>
                <th className={columnStyle}>시즌</th>
                {pitcherFields.map((f) => (
                  <th key={f.key} className={columnStyle}>{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seasons.map((season) => {
                const row = pitcher[season] || {};
                return (
                  <tr key={season} className="border-b border-tableLine hover:bg-zinc-900">
                    <td className={columnStyle}>{season === "career" ? "누적" : season + "시즌"}</td>
                    {pitcherFields.map((f) => {
                      const val = row[f.key];
                      const digits = f.digits || 0;
                      if (f.format)
                        return <td key={f.key} className={columnStyle}>{f.format(val)}</td>;
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