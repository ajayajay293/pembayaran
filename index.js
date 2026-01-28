const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const qs = require('qs');
const express = require('express');

const app = express();
app.use(express.json());

// --- KONFIGURASI ---
const BOT_TOKEN = '8526480569:AAGE95lI-BO2_q6yvlwfzPqwsyUXlN6uFxc';
const API_KEY = 'cIr6yFSfNiCtzfOw50IIb8xvviGlG4U9o7wLe60Pvrz9os0Ff0ARoAMKdNj7YyqVYi25YtfQoyGVlPo8ce3wAuawklZJlqJF6mmN';
const ADMIN_ID = '7810623034';

const bot = new Telegraf(BOT_TOKEN);

// Helper Request ke Atlantic
const atlanticReq = async (path, data) => {
    return axios.post(`https://atlantich2h.com${path}`, qs.stringify({
        api_key: API_KEY,
        ...data
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
};

// --- API ENDPOINTS ---

app.post('/api/create', async (req, res) => {
    try {
        const { nominal } = req.body;
        const response = await atlanticReq('/deposit/create', {
            nominal: nominal,
            reff_id: 'JARR' + Date.now(),
            type: 'ewallet',
            metode: 'qris'
        });
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
});

app.post('/api/status', async (req, res) => {
    try {
        const { id } = req.body;
        const s = await atlanticReq('/deposit/status', { id });
        
        if (s.data.data && s.data.data.status === 'processing') {
            await atlanticReq('/deposit/instant', { id, action: 'true' });
        }
        
        if (s.data.data && s.data.data.status === 'success') {
            bot.telegram.sendMessage(ADMIN_ID, `✅ <b>BAYAR BERHASIL</b>\nID: <code>${id}</code>\nNominal: <code>${s.data.data.nominal}</code>`, { parse_mode: 'HTML' });
        }
        res.json(s.data);
    } catch (e) {
        res.status(500).json({ status: false });
    }
});

app.post('/api/cancel', async (req, res) => {
    try {
        const { id } = req.body;
        const response = await atlanticReq('/deposit/cancel', { id });
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ status: false });
    }
});

// --- BOT LOGIC ---
bot.start((ctx) => {
    ctx.replyWithHTML(`💎 <b>JARR PAYMENT ONLINE</b>\nSilakan klik tombol di bawah untuk membayar.`, 
    Markup.inlineKeyboard([[Markup.button.url('🌐 BAYAR SEKARANG', 'https://pembayaran-livid.vercel.app')]]));
});

bot.launch();
app.listen(process.env.PORT || 3000);
module.exports = app;
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
});

// 2. API Status + Auto Instant
app.post('/api/status', async (req, res) => {
    try {
        const { id } = req.body;
        const s = await atlanticReq('/deposit/status', { id });
        const st = s.data.data;

        if (st.status === 'processing') {
            await atlanticReq('/deposit/instant', { id, action: 'true' });
        }

        if (st.status === 'success') {
            bot.telegram.sendMessage(ADMIN_ID, `<b>✅ PEMBAYARAN MASUK (WEB)</b>\nID: <code>${id}</code>\nNominal: <code>Rp${st.nominal.toLocaleString()}</code>`, { parse_mode: 'HTML' });
        }
        res.json(s.data);
    } catch (e) {
        res.status(500).json({ status: false });
    }
});

// 3. API Cancel
app.post('/api/cancel', async (req, res) => {
    try {
        const { id } = req.body;
        const response = await atlanticReq('/deposit/cancel', { id });
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ status: false });
    }
});

// --- [ BOT LOGIC ] ---
bot.start((ctx) => {
    ctx.replyWithHTML(`<b>💎 JARR PAYMENT</b>\nSilakan akses web untuk bayar.`, 
    Markup.inlineKeyboard([[Markup.button.url('🌐 BAYAR SEKARANG', 'https://pembayaran-livid.vercel.app')]]));
});

// Webhook untuk Vercel agar Bot & Express jalan barep
bot.launch();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server & Bot Online di Port ${PORT}`));

module.exports = app;
