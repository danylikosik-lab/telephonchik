import { ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH } from "../config/constants.js";

export function generateRoomCode(): string {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LENGTH; i += 1) {
    const idx = Math.floor(Math.random() * ROOM_CODE_ALPHABET.length);
    code += ROOM_CODE_ALPHABET[idx]!;
  }
  return code;
}

