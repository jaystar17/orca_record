// src/utils/playerUtils.js
import profiles from "../data/players_profile.json";

/** 프로필에 등록된 선수만 필터링 */
export function filterByProfiles(players) {
  const allowedNames = new Set(profiles.map((p) => p.이름));
  return players.filter((p) => allowedNames.has(p.이름));
}

/** 선수 프로필 정보 가져오기 */
export function getPlayerProfile(name) {
  return profiles.find((p) => p.이름 === name);
}