import { GoogleGenAI, Modality } from "@google/genai";
import { Question, QuestionType, TARGET_RHYMES } from "../types";

// Lazy Initialize Gemini Client
let ai: GoogleGenAI | null = null;

const getAi = () => {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

// --- DATASET: Single characters only to ensure strict Initial + Rhyme logic ---
const WORD_BANK: Record<string, { char: string; pinyin: string; mean: string }[]> = {
  ua: [
    { char: '花', pinyin: 'huā', mean: 'Flower' }, { char: '瓜', pinyin: 'guā', mean: 'Melon' },
    { char: '畫', pinyin: 'huà', mean: 'Picture' }, { char: '蛙', pinyin: 'wā', mean: 'Frog' },
    { char: '刷', pinyin: 'shuā', mean: 'Brush' }, { char: '抓', pinyin: 'zhuā', mean: 'Grab' },
    { char: '掛', pinyin: 'guà', mean: 'Hang' }, { char: '誇', pinyin: 'kuā', mean: 'Praise' },
    { char: '襪', pinyin: 'wà', mean: 'Socks' }, { char: '滑', pinyin: 'huá', mean: 'Slide' },
    { char: '挖', pinyin: 'wā', mean: 'Dig' }, { char: '娃', pinyin: 'wá', mean: 'Doll' },
    { char: '瓦', pinyin: 'wǎ', mean: 'Tile' }, { char: '耍', pinyin: 'shuǎ', mean: 'Play' },
    { char: '跨', pinyin: 'kuà', mean: 'Step' }, { char: '划', pinyin: 'huá', mean: 'Row' },
    { char: '化', pinyin: 'huà', mean: 'Melt' }, { char: '嘩', pinyin: 'huā', mean: 'Crash' },
    { char: '寡', pinyin: 'guǎ', mean: 'Few' }, { char: '褂', pinyin: 'guà', mean: 'Gown' }
  ],
  uo: [
    { char: '火', pinyin: 'huǒ', mean: 'Fire' }, { char: '多', pinyin: 'duō', mean: 'Many' },
    { char: '我', pinyin: 'wǒ', mean: 'Me' }, { char: '國', pinyin: 'guó', mean: 'Country' },
    { char: '果', pinyin: 'guǒ', mean: 'Fruit' }, { char: '坐', pinyin: 'zuò', mean: 'Sit' },
    { char: '做', pinyin: 'zuò', mean: 'Do' }, { char: '錯', pinyin: 'cuò', mean: 'Wrong' },
    { char: '說', pinyin: 'shuō', mean: 'Speak' }, { char: '桌', pinyin: 'zhuō', mean: 'Table' },
    { char: '落', pinyin: 'luò', mean: 'Fall' }, { char: '脫', pinyin: 'tuō', mean: 'Take off' },
    { char: '拖', pinyin: 'tuō', mean: 'Drag' }, { char: '駱', pinyin: 'luò', mean: 'Camel' },
    { char: '捉', pinyin: 'zhuō', mean: 'Catch' }, { char: '縮', pinyin: 'suō', mean: 'Shrink' },
    { char: '活', pinyin: 'huó', mean: 'Alive' }, { char: '鍋', pinyin: 'guō', mean: 'Pot' },
    { char: '朵', pinyin: 'duǒ', mean: 'Flower' }, { char: '左', pinyin: 'zuǒ', mean: 'Left' }
  ],
  uai: [
    { char: '怪', pinyin: 'guài', mean: 'Strange' }, { char: '快', pinyin: 'kuài', mean: 'Fast' },
    { char: '壞', pinyin: 'huài', mean: 'Bad' }, { char: '摔', pinyin: 'shuāi', mean: 'Fall' },
    { char: '外', pinyin: 'wài', mean: 'Outside' }, { char: '帥', pinyin: 'shuài', mean: 'Handsome' },
    { char: '乖', pinyin: 'guāi', mean: 'Obedient' }, { char: '懷', pinyin: 'huái', mean: 'Bosom' },
    { char: '拽', pinyin: 'zhuài', mean: 'Pull' }, { char: '踹', pinyin: 'chuài', mean: 'Kick' },
    { char: '拐', pinyin: 'guǎi', mean: 'Turn' }, { char: '歪', pinyin: 'wāi', mean: 'Askew' },
    { char: '筷', pinyin: 'kuài', mean: 'Chopsticks' }, { char: '槐', pinyin: 'huái', mean: 'Locust tree' },
    { char: '踝', pinyin: 'huái', mean: 'Ankle' }, { char: '率', pinyin: 'shuài', mean: 'Rate' },
    { char: '衰', pinyin: 'shuāi', mean: 'Fail' }, { char: '揣', pinyin: 'chuāi', mean: 'Put in' },
    { char: '塊', pinyin: 'kuài', mean: 'Piece' }
  ],
  uei: [ // Pinyin: ui
    { char: '水', pinyin: 'shuǐ', mean: 'Water' }, { char: '對', pinyin: 'duì', mean: 'Correct' },
    { char: '會', pinyin: 'huì', mean: 'Can' }, { char: '貴', pinyin: 'guì', mean: 'Expensive' },
    { char: '腿', pinyin: 'tuǐ', mean: 'Leg' }, { char: '嘴', pinyin: 'zuǐ', mean: 'Mouth' },
    { char: '歲', pinyin: 'suì', mean: 'Age' }, { char: '睡', pinyin: 'shuì', mean: 'Sleep' },
    { char: '龜', pinyin: 'guī', mean: 'Turtle' }, { char: '灰', pinyin: 'huī', mean: 'Grey' },
    { char: '回', pinyin: 'huí', mean: 'Return' }, { char: '吹', pinyin: 'chuī', mean: 'Blow' },
    { char: '追', pinyin: 'zhuī', mean: 'Chase' }, { char: '推', pinyin: 'tuī', mean: 'Push' },
    { char: '堆', pinyin: 'duī', mean: 'Pile' }, { char: '隊', pinyin: 'duì', mean: 'Team' },
    { char: '雷', pinyin: 'léi', mean: 'Thunder' }, { char: '內', pinyin: 'nèi', mean: 'Inside' },
    { char: '醉', pinyin: 'zuì', mean: 'Drunk' }, { char: '罪', pinyin: 'zuì', mean: 'Guilt' }
  ],
  uan: [
    { char: '關', pinyin: 'guān', mean: 'Close' }, { char: '船', pinyin: 'chuán', mean: 'Boat' },
    { char: '暖', pinyin: 'nuǎn', mean: 'Warm' }, { char: '亂', pinyin: 'luàn', mean: 'Messy' },
    { char: '酸', pinyin: 'suān', mean: 'Sour' }, { char: '轉', pinyin: 'zhuàn', mean: 'Turn' },
    { char: '換', pinyin: 'huàn', mean: 'Change' }, { char: '玩', pinyin: 'wán', mean: 'Play' },
    { char: '短', pinyin: 'duǎn', mean: 'Short' }, { char: '端', pinyin: 'duān', mean: 'Hold' },
    { char: '算', pinyin: 'suàn', mean: 'Count' }, { char: '蒜', pinyin: 'suàn', mean: 'Garlic' },
    { char: '傳', pinyin: 'chuán', mean: 'Pass' }, { char: '穿', pinyin: 'chuān', mean: 'Wear' },
    { char: '軟', pinyin: 'ruǎn', mean: 'Soft' }, { char: '碗', pinyin: 'wǎn', mean: 'Bowl' },
    { char: '團', pinyin: 'tuán', mean: 'Group' }, { char: '鑽', pinyin: 'zuān', mean: 'Drill' },
    { char: '喚', pinyin: 'huàn', mean: 'Call' }, { char: '緩', pinyin: 'huǎn', mean: 'Slow' }
  ],
  uen: [ // Pinyin: un
    { char: '輪', pinyin: 'lún', mean: 'Wheel' }, { char: '村', pinyin: 'cūn', mean: 'Village' },
    { char: '春', pinyin: 'chūn', mean: 'Spring' }, { char: '蹲', pinyin: 'dūn', mean: 'Squat' },
    { char: '孫', pinyin: 'sūn', mean: 'Grandson' }, { char: '吞', pinyin: 'tūn', mean: 'Swallow' },
    { char: '問', pinyin: 'wèn', mean: 'Ask' }, { char: '困', pinyin: 'kùn', mean: 'Sleepy' },
    { char: '準', pinyin: 'zhǔn', mean: 'Accurate' }, { char: '順', pinyin: 'shùn', mean: 'Smooth' },
    { char: '盾', pinyin: 'dùn', mean: 'Shield' }, { char: '棍', pinyin: 'gùn', mean: 'Stick' },
    { char: '混', pinyin: 'hùn', mean: 'Mix' }, { char: '婚', pinyin: 'hūn', mean: 'Marriage' },
    { char: '魂', pinyin: 'hún', mean: 'Soul' }, { char: '損', pinyin: 'sǔn', mean: 'Damage' },
    { char: '存', pinyin: 'cún', mean: 'Exist' }, { char: '寸', pinyin: 'cùn', mean: 'Inch' },
    { char: '潤', pinyin: 'rùn', mean: 'Moist' }, { char: '噸', pinyin: 'dūn', mean: 'Ton' }
  ],
  uang: [
    { char: '光', pinyin: 'guāng', mean: 'Light' }, { char: '黃', pinyin: 'huáng', mean: 'Yellow' },
    { char: '窗', pinyin: 'chuāng', mean: 'Window' }, { char: '雙', pinyin: 'shuāng', mean: 'Pair' },
    { char: '撞', pinyin: 'zhuàng', mean: 'Hit' }, { char: '礦', pinyin: 'kuàng', mean: 'Mine' },
    { char: '王', pinyin: 'wáng', mean: 'King' }, { char: '床', pinyin: 'chuáng', mean: 'Bed' },
    { char: '框', pinyin: 'kuāng', mean: 'Frame' }, { char: '謊', pinyin: 'huǎng', mean: 'Lie' },
    { char: '網', pinyin: 'wǎng', mean: 'Net' }, { char: '往', pinyin: 'wǎng', mean: 'Towards' },
    { char: '忘', pinyin: 'wàng', mean: 'Forget' }, { char: '狂', pinyin: 'kuáng', mean: 'Crazy' },
    { char: '霜', pinyin: 'shuāng', mean: 'Frost' }, { char: '爽', pinyin: 'shuǎng', mean: 'Cool' },
    { char: '裝', pinyin: 'zhuāng', mean: 'Pretend' }, { char: '莊', pinyin: 'zhuāng', mean: 'Village' },
    { char: '狀', pinyin: 'zhuàng', mean: 'Shape' }, { char: '壯', pinyin: 'zhuàng', mean: 'Strong' }
  ],
  ueng: [
    { char: '翁', pinyin: 'wēng', mean: 'Old man' }, { char: '甕', pinyin: 'wěng', mean: 'Urn' },
    { char: '嗡', pinyin: 'wēng', mean: 'Buzz' }, { char: '蕹', pinyin: 'wèng', mean: 'Spinach' }
  ]
};

// Fun emojis for decoration
const EMOJIS = ['🌟', '✨', '🎈', '🎨', '🎪', '🧸', '🌈', '🍭', '🍦', '🍩', '🐶', '🐱', '🐰', '🦊'];

/**
 * Extracts the "Initial" sound representation from Pinyin for the game purpose.
 * E.g., huā -> h, wā -> w, shuǐ -> sh
 */
function getInitial(pinyin: string): string {
  // Normalize to remove accents
  const norm = pinyin.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Match standard initials or w/y/z/c/s/zh/ch/sh
  const match = norm.match(/^(zh|ch|sh|[bpmfdtnlgkhjqxrwzy])/);
  return match ? match[0] : '';
}

function shuffle(array: any[]) {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * Generates quiz questions: Initial + ___ = Char?
 */
export const generateGameContent = async (count: number = 8): Promise<Question[]> => {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const rhyme = TARGET_RHYMES[i % TARGET_RHYMES.length] as string;
    const words = WORD_BANK[rhyme];
    const word = words[Math.floor(Math.random() * words.length)];
    
    // Always this type: Given initial, find rhyme.
    const type = QuestionType.FILL_BLANK;

    // Provide ALL 8 rhymes as options every time
    const options = shuffle([...TARGET_RHYMES]);
    const initial = getInitial(word.pinyin);
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    let q: Question = {
      id: `q-${i}-${Date.now()}`,
      type: type,
      rhyme: rhyme as any,
      promptText: `${emoji} ${word.char} = ${initial} + ___`, // e.g., 🌟 花 = h + ___
      options: options,
      correctAnswer: rhyme,
      explanation: `"${word.char}" 的拼音是 ${word.pinyin} (${initial} + ${rhyme})。`
    };

    questions.push(q);
  }

  return questions;
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const aiInstance = getAi();
    const response = await aiInstance.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    return null;

  } catch (error) {
    console.error("TTS generation failed:", error);
    return null;
  }
};