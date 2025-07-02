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
    (parseFloat(hitter?.career?.WAR || 0) + parseFloat(pitcher?.career?.WAR || 0)) ||
    0
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

  const columnStyle = `w-[5.88%]`;

  return (
    <div className="p-4 max-w-[1600px] mx-auto">
      <button
        onClick={() => navigate("/")}
        className="text-blue-600 hover:underline text-sm mb-4"
      >
        ← 메인으로 돌아가기
      </button>

      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        {name} 선수 상세 기록
      </h2>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
        <div className="border rounded-xl p-4 shadow bg-white">
          <div className="text-sm text-gray-500">이름</div>
          <div className="text-lg font-semibold">{profile?.이름 || "-"}</div>
        </div>
        <div className="border rounded-xl p-4 shadow bg-white">
          <div className="text-sm text-gray-500">등번호</div>
          <div className="text-lg font-semibold">{profile?.등번호 || "-"}</div>
        </div>
        <div className="border rounded-xl p-4 shadow bg-white">
          <div className="text-sm text-gray-500">포지션</div>
          <div className="text-lg font-semibold">{profile?.포지션 || "-"}</div>
        </div>

        <div className="border rounded-xl p-4 shadow bg-white">
          <div className="text-sm text-gray-500">통합 WAR</div>
          <div className="text-lg font-bold text-blue-600">{WAR}</div>
        </div>

        {hitter?.career?.출루율 && hitter?.career?.장타율 && (
          <div className="border rounded-xl p-4 shadow bg-white">
            <div className="text-sm text-gray-500">누적 OPS</div>
            <div className="text-lg font-bold text-green-600">
              {(parseFloat(hitter.career.출루율) + parseFloat(hitter.career.장타율)).toFixed(3)}
            </div>
          </div>
        )}

        {pitcher?.career?.ERA && (
          <div className="border rounded-xl p-4 shadow bg-white">
            <div className="text-sm text-gray-500">누적 ERA</div>
            <div className="text-lg font-bold text-red-600">
              {parseFloat(pitcher.career.ERA).toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* 타자 테이블 */}
      {Object.keys(hitter).length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <table className="min-w-[1600px] w-full table-fixed border border-collapse text-sm text-center whitespace-nowrap">
            <thead className="bg-gray-100 font-semibold">
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
                  <tr key={season} className={i === 0 ? "border-b border-gray-300" : ""}>
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

      {/* 투수 테이블 */}
      {Object.keys(pitcher).length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-[1600px] w-full table-fixed border border-collapse text-sm text-center whitespace-nowrap">
            <thead className="bg-blue-100 font-semibold">
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
                  <tr key={season} className={i === 0 ? "border-b border-gray-300" : ""}>
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