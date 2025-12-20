
import { GoogleGenAI, Modality } from "@google/genai";
import { Question, QuestionType, TARGET_RHYMES, TongueTwister } from "../types";

const COOKING_ITEMS = [
  { name: '炒鍋', icon: '🍳' }, { name: '湯勺', icon: '🥄' }, { name: '菜刀', icon: '🔪' }, { name: '胡蘿蔔', icon: '🥕' },
  { name: '大白菜', icon: '🥬' }, { name: '鮮肉', icon: '🥩' }, { name: '調味料', icon: '🧂' }, { name: '大盤子', icon: '🍽️' },
  { name: '麵條', icon: '🍜' }, { name: '火鍋', icon: '🥘' }, { name: '湯碗', icon: '🥣' }, { name: '冰塊', icon: '🧊' },
  { name: '牛奶', icon: '🥛' }, { name: '三明治', icon: '🥪' }, { name: '捲餅', icon: '🌮' }, { name: '披薩', icon: '🍕' },
  { name: '薯條', icon: '🍟' }, { name: '果汁', icon: '🥤' }, { name: '布丁', icon: '🍮' }, { name: '蛋糕', icon: '🍰' }
];

const WORD_BANK: Record<string, { char: string; pinyin: string }[]> = {
  ua: [{ char: '花', pinyin: 'huā' }, { char: '瓜', pinyin: 'guā' }, { char: '蛙', pinyin: 'wā' }],
  uo: [{ char: '火', pinyin: 'huǒ' }, { char: '多', pinyin: 'duō' }, { char: '果', pinyin: 'guǒ' }],
  uai: [{ char: '怪', pinyin: 'guài' }, { char: '快', pinyin: 'kuài' }, { char: '帥', pinyin: 'shuài' }],
  uei: [{ char: '水', pinyin: 'shuǐ' }, { char: '對', pinyin: 'duì' }, { char: '會', pinyin: 'huì' }],
  uan: [{ char: '關', pinyin: 'guān' }, { char: '穿', pinyin: 'chuān' }, { char: '碗', pinyin: 'wǎn' }],
  uen: [{ char: '春', pinyin: 'chūn' }, { char: '雲', pinyin: 'yún' }, { char: '輪', pinyin: 'lún' }],
  uang: [{ char: '光', pinyin: 'guāng' }, { char: '黃', pinyin: 'huáng' }, { char: '床', pinyin: 'chuáng' }],
  ueng: [{ char: '翁', pinyin: 'wēng' }, { char: '嗡', pinyin: 'wēng' }, { char: '甕', pinyin: 'wèng' }]
};

const PREDEFINED_TWISTERS: TongueTwister[] = [
  { id: 1, text: "娃娃畫花，花掛娃娃。", focusRhyme: "ua", translation: "The doll draws a flower, and the flower is hung on the doll." },
  { id: 2, text: "鍋裡有火，火上有鍋。", focusRhyme: "uo", translation: "There is fire in the pot, and a pot on the fire." },
  { id: 3, text: "乖乖學快，快快學乖。", focusRhyme: "uai", translation: "Be good and learn fast, learn fast and be good." },
  { id: 4, text: "水裡有龜，龜戲水吹。", focusRhyme: "uei", translation: "There's a turtle in the water, playing and blowing bubbles." },
  { id: 5, text: "穿上短船，船穿大關。", focusRhyme: "uan", translation: "Wearing short boat-shoes, the boat passes the grand gate." },
  { id: 6, text: "春雲滾輪，輪滾春雲。", focusRhyme: "uen", translation: "Spring clouds roll like wheels, wheels roll like spring clouds." },
  { id: 7, text: "黃光照窗，窗映黃光。", focusRhyme: "uang", translation: "Yellow light shines on the window, the window reflects yellow light." },
  { id: 8, text: "翁抓老甕，甕中有嗡。", focusRhyme: "ueng", translation: "The old man grabs the urn, there is a buzzing in the urn." },
  { id: 9, text: "碗裡有水，水裡有碗。", focusRhyme: "uei", translation: "Water in the bowl, a bowl in the water." },
  { id: 10, text: "鍋長框廣，框廣鍋長。", focusRhyme: "uang", translation: "The pot is long and the frame is wide." }
];

const getInitial = (pinyin: string): string => {
  const norm = pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const match = norm.match(/^(zh|ch|sh|[bpmfdtnlgkhjqxrwzy])/);
  return match ? match[0] : '';
};

export const generateGameContent = async (count: number, mode: 'river' | 'cooking'): Promise<Question[]> => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const rhyme = TARGET_RHYMES[i % TARGET_RHYMES.length];
    const words = WORD_BANK[rhyme];
    const word = words[Math.floor(Math.random() * words.length)];
    const initial = getInitial(word.pinyin);
    
    // Changed " + ?" to " ______" as requested
    questions.push({
      id: `q-${mode}-${i}`,
      type: QuestionType.FILL_BLANK,
      rhyme,
      promptText: mode === 'cooking' ? `${COOKING_ITEMS[i].icon} ${word.char} = ${initial} ______` : `${word.char} = ${initial} ______`,
      options: [...TARGET_RHYMES].sort(() => Math.random() - 0.5),
      correctAnswer: rhyme,
      explanation: `"${word.char}" 的拼音是 ${word.pinyin}。`,
      itemImage: mode === 'cooking' ? COOKING_ITEMS[i].icon : undefined
    });
  }
  return questions;
};

export const generateTongueTwisters = async (): Promise<TongueTwister[]> => {
  return PREDEFINED_TWISTERS;
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `用親切的語氣讀出：${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (e) {
    console.error("Gemini TTS Error:", e);
    return null;
  }
};
