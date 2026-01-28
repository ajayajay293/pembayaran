const { Telegraf, Markup } = require('telegraf');

// --- [ CONFIGURATION ] ---
const BOT_TOKEN = '8526480569:AAGE95lI-BO2_q6yvlwfzPqwsyUXlN6uFxc';
const OWNER_TAG = '@JarrGanteng';
const WEB_URL = 'https://pembayaran-livid.vercel.app'; // Ganti dengan domain Vercel Anda

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    const msg = `
<b>〔 💎 JARR PAYMENT GATEWAY 💎 〕</b>
━━━━━━━━━━━━━━━━━━━━━━━
Halo <b>${ctx.from.first_name}</b>, 

Untuk melakukan pembayaran ke <b>${OWNER_TAG}</b>, 
silakan gunakan tautan pembayaran resmi kami di bawah ini.

<b>✨ KELEBIHAN WEB:</b>
✅ Tampilan Full Animasi
✅ Cek Status Otomatis (Real-time)
✅ QRIS Support Semua Bank/E-Wallet
━━━━━━━━━━━━━━━━━━━━━━━`;
    
    ctx.replyWithHTML(msg, Markup.inlineKeyboard([
        [Markup.button.url('🌐 BUKA LINK PEMBAYARAN', WEB_URL)]
    ]));
});

bot.launch().then(() => console.log("Bot Jarr Payment Online!"));
