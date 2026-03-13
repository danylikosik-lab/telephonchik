export interface SpeechOptions {
  enabled: boolean;
  rate: number;
  voiceName?: string | null;
}

let cachedVoices: SpeechSynthesisVoice[] | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (cachedVoices) return Promise.resolve(cachedVoices);
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }
    const handle = () => {
      const list = synth.getVoices();
      cachedVoices = list;
      resolve(list);
      synth.removeEventListener("voiceschanged", handle);
    };
    synth.addEventListener("voiceschanged", handle);
  });
}

export async function speakRussian(text: string, options: SpeechOptions): Promise<void> {
  if (!options.enabled || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const voices = await loadVoices();
  const ruVoice =
    voices.find((v) => v.lang.toLowerCase().startsWith("ru") && (!options.voiceName || v.name === options.voiceName)) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("ru")) ??
    voices[0];

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = options.rate || 1;
  if (ruVoice) utter.voice = ruVoice;
  synth.speak(utter);
}

