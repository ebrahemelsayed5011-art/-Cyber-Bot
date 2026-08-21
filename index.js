import './src/app.js';
import { setupBroadcast } from './broadcast.js';

// فحص دوري آمن لالتقاط البوت فور تشغيله وتفعيل الميزة عليه
let searchBot = setInterval(() => {
    let currentBot = typeof client !== 'undefined' ? client : (typeof bot !== 'undefined' ? bot : null);
    if (currentBot) {
        setupBroadcast(currentBot);
        clearInterval(searchBot);
    }
}, 1000);

