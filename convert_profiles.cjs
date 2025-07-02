const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

// 프로필 엑셀 파일 경로
const profilePath = path.join(__dirname, "src", "data", "profile.xlsx");

// 엑셀 불러오기
const workbook = xlsx.readFile(profilePath);
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// JSON 저장
fs.writeFileSync(
  path.join(__dirname, "src", "data", "players_profile.json"),
  JSON.stringify(data, null, 2),
  "utf8"
);

console.log("✅ 변환 완료: players_profile.json 생성됨");