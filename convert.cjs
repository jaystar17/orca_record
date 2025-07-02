const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

// 파일 경로
const hitterPath = path.join(__dirname, "src", "data", "hitter.xlsx");
const pitcherPath = path.join(__dirname, "src", "data", "pitcher.xlsx");

// 엑셀 불러오기
const hitterWorkbook = xlsx.readFile(hitterPath);
const pitcherWorkbook = xlsx.readFile(pitcherPath);

// 타자 시트 → 마지막 줄 누적 데이터 추출
const hitterPlayers = hitterWorkbook.SheetNames.map((sheetName) => {
  const rows = xlsx.utils.sheet_to_json(hitterWorkbook.Sheets[sheetName]);
  const last = rows[rows.length - 1] || {};

  return {
    이름: sheetName,
    등번호: last.등번호 || "",
    포지션: last.포지션 || "",
    type: "hitter",
    hitterStats: last,
  };
});

// 투수 시트 → 마지막 줄 누적 데이터 추출
const pitcherPlayers = pitcherWorkbook.SheetNames.map((sheetName) => {
  const rows = xlsx.utils.sheet_to_json(pitcherWorkbook.Sheets[sheetName]);
  const last = rows[rows.length - 1] || {};

  return {
    이름: sheetName,
    등번호: last.등번호 || "",
    포지션: last.포지션 || "",
    type: "pitcher",
    pitcherStats: last,
  };
});

// 저장
fs.writeFileSync(
  path.join(__dirname, "src", "data", "players_hitter.json"),
  JSON.stringify(hitterPlayers, null, 2),
  "utf8"
);
fs.writeFileSync(
  path.join(__dirname, "src", "data", "players_pitcher.json"),
  JSON.stringify(pitcherPlayers, null, 2),
  "utf8"
);

console.log("✅ 변환 완료: 누적 데이터를 기반으로 JSON 파일 생성됨");
