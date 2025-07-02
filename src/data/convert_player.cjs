const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

// 엑셀 파일이 현재 파일과 같은 src/data/ 경로에 존재
const hitterPath = path.join(__dirname, "hitter.xlsx");
const pitcherPath = path.join(__dirname, "pitcher.xlsx");

const extractSeasonAndName = (sheetName) => {
  const match = sheetName.match(/^(\d{2})\s(.+)$/);
  if (match) {
    return { year: match[1], name: match[2] };
  }
  return { year: "career", name: sheetName };
};

const extractSeasonKey = (rowName) => {
  if (typeof rowName !== "string") return null;
  const match = rowName.match(/^(\d{2})\s(.+)$/);
  if (match) return { year: match[1], name: match[2] };
  return { year: "career", name: rowName };
};

const getWARsheet = (workbook, sheetName, targetName) => {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return {};
  const rows = xlsx.utils.sheet_to_json(sheet);
  return rows.find((row) => row.이름 === targetName) || {};
};

const buildPlayerData = (workbook, type, warWorkbook) => {
  const players = {};

  workbook.SheetNames.forEach((sheetName) => {
    const { year: sheetYear, name: sheetNameOnly } = extractSeasonAndName(sheetName);
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    rows.forEach((row) => {
      const info = extractSeasonKey(row[Object.keys(row)[0]]);
      if (!info) return;
      const { year, name: rowName } = info;

      if (!players[rowName]) players[rowName] = { hitter: {}, pitcher: {} };
      players[rowName][type][year] = row;

      // WAR, wRC+ 정보 추가
      let warSheetName = "";
      if (year === "career") warSheetName = type === "hitter" ? "타자 기록" : "투수 기록";
      else warSheetName = `${year} ${type === "hitter" ? "타자 기록" : "투수 기록"}`;

      const extraStats = getWARsheet(warWorkbook, warSheetName, `${year === "career" ? "" : year + " "}${rowName}`.trim());
      if (extraStats) {
        if (type === "hitter") {
          players[rowName]["hitter"][year]["WAR"] = extraStats["WAR"];
          players[rowName]["hitter"][year]["wRC+"] = extraStats["wRC+"];
        } else {
          players[rowName]["pitcher"][year]["WAR"] = extraStats["WAR"];
        }
      }
    });
  });

  return players;
};

const hitterWorkbook = xlsx.readFile(hitterPath);
const pitcherWorkbook = xlsx.readFile(pitcherPath);

const hitterData = buildPlayerData(hitterWorkbook, "hitter", hitterWorkbook);
const pitcherData = buildPlayerData(pitcherWorkbook, "pitcher", pitcherWorkbook);

// merge hitter and pitcher data by player name
const allPlayers = {};

const addToAll = (data, type) => {
  Object.keys(data).forEach((name) => {
    if (!allPlayers[name]) allPlayers[name] = { hitter: {}, pitcher: {} };
    allPlayers[name][type] = { ...allPlayers[name][type], ...data[name][type] };
  });
};

addToAll(hitterData, "hitter");
addToAll(pitcherData, "pitcher");

fs.writeFileSync(
  path.join(__dirname, "players_hitter.json"),
  JSON.stringify(allPlayers, null, 2),
  "utf8"
);

fs.writeFileSync(
  path.join(__dirname, "players_pitcher.json"),
  JSON.stringify(allPlayers, null, 2),
  "utf8"
);

console.log("✅ 변환 완료: 시즌별/누적 데이터를 포함하여 WAR 및 wRC+까지 JSON에 추가 완료!");