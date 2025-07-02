// src/Leaderboard.jsx
import hitters from "./data/players_hitter.json";
import pitchers from "./data/players_pitcher.json";
import { Link } from "react-router-dom";

function getTopPlayers(players, metric, asc = false, limit = 5) {
  return [...players]
    .filter((p) => p?.[metric] !== undefined || p?.hitterStats?.[metric] !== undefined || p?.pitcherStats?.[metric] !== undefined)
    .sort((a, b) => {
      const aVal = a.hitterStats?.[metric] ?? a.pitcherStats?.[metric] ?? 0;
      const bVal = b.hitterStats?.[metric] ?? b.pitcherStats?.[metric] ?? 0;
      return asc ? aVal - bVal : bVal - aVal;
    })
    .slice(0, limit);
}

function Leaderboard() {
  const topBattingAvg = getTopPlayers(hitters, "타율");
  const topERA = getTopPlayers(pitchers, "ERA", true);
  const topWAR = getTopPlayers([...hitters, ...pitchers], "WAR");

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center text-purple-700 mb-4">🏆 리더보드</h1>

      {/* 타율 상위 */}
      <section>
        <h2 className="text-lg font-semibold mb-2">타율 TOP 5</h2>
        <ul className="bg-white rounded-xl shadow divide-y">
          {topBattingAvg.map((p, i) => (
            <li key={i} className="px-4 py-2 flex justify-between">
              <Link to={`/player/${p.이름}`} className="text-blue-600 hover:underline">
                {p.이름}
              </Link>
              <span>{p.hitterStats?.타율 ?? "-"}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ERA 상위 */}
      <section>
        <h2 className="text-lg font-semibold mt-4 mb-2">ERA TOP 5</h2>
        <ul className="bg-white rounded-xl shadow divide-y">
          {topERA.map((p, i) => (
            <li key={i} className="px-4 py-2 flex justify-between">
              <Link to={`/player/${p.이름}`} className="text-blue-600 hover:underline">
                {p.이름}
              </Link>
              <span>{p.pitcherStats?.ERA ?? "-"}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Leaderboard;
