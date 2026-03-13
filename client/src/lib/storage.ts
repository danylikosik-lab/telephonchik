const NICKNAME_KEY = "telefonchik_nickname";
const COLOR_KEY = "telefonchik_avatar_color";

export function saveProfile(nickname: string, avatarColor: string) {
  localStorage.setItem(NICKNAME_KEY, nickname);
  localStorage.setItem(COLOR_KEY, avatarColor);
}

export function loadProfile(): { nickname: string; avatarColor: string } {
  return {
    nickname: localStorage.getItem(NICKNAME_KEY) ?? "",
    avatarColor: localStorage.getItem(COLOR_KEY) ?? "#ffdf40",
  };
}

