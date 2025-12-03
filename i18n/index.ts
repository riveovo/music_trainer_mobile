
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Translations
const en = {
    translation: {
        "title": "Music Trainer",
        "notes": "Notes",
        "intervals": "Intervals",
        "direction": "Direction",
        "melody": "Melody",
        "mode": "Mode",
        "random": "RND",
        "sequential": "SEQ",
        "audio": "Audio",
        "speed": "Speed",
        "start": "START",
        "stop": "STOP",
        "press_start": "PRESS START",
        "ready": "READY",
        "tuning": "Tuning Strings...",
        "downloading": "Downloading Guitar...",
        "playing": "Playing...",
        "tap_replay": "Tap to Replay",
        "identify_interval": "Identify the interval played (Ascending or Descending).",
        "identify_direction": "Identify if the second note is Higher or Lower.",
        "identify_melody": "Memorize the melody contour.",
        "higher": "Higher",
        "lower": "Lower",
        "correct": "Correct!",
        "wrong": "Wrong!",
        "check": "Check",
        "next": "Next",
        "footer": "© 2025 Note Trainer // NEO-BRUTALISM EDITION"
    }
};

const zh = {
    translation: {
        "title": "音感训练",
        "notes": "音名",
        "intervals": "音程",
        "direction": "听辨",
        "melody": "旋律",
        "mode": "模式",
        "random": "随机",
        "sequential": "顺序",
        "audio": "声音",
        "speed": "速度",
        "start": "开始",
        "stop": "停止",
        "press_start": "点击开始",
        "ready": "准备",
        "tuning": "正在调音...",
        "downloading": "加载吉他音色...",
        "playing": "播放中...",
        "tap_replay": "点击重播",
        "identify_interval": "辨别播放的音程（上行或下行）。",
        "identify_direction": "辨别第二个音是更高还是更低。",
        "identify_melody": "记住旋律的轮廓。",
        "higher": "更高",
        "lower": "更低",
        "correct": "正确！",
        "wrong": "错误！",
        "check": "检查",
        "next": "下一题",
        "footer": "© 2025 音感训练 // 新粗野主义版"
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en,
            zh
        },
        lng: Localization.getLocales()[0].languageCode?.startsWith('zh') ? 'zh' : 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
