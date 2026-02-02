const { Telegraf } = require('telegraf');
const axios = require('axios');
const qs = require('qs');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Layani file statis (HTML)
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIG ---
const BOT_TOKEN = '8526480569:AAGE95lI-BO2_q6yvlwfzPqwsyUXlN6uFxc';
const API_KEY = 'cIr6yFSfNiCtzfOw50IIb8xvviGlG4U9o7wLe60Pvrz9os0Ff0ARoAMKdNj7YyqVYi25YtfQoyGVlPo8ce3wAuawklZJlqJF6mmN';
const ADMIN_ID = '7810623034';

const bot = new Telegraf(BOT_TOKEN);

// Fungsi request ke AtlanticH2H
const atlanticReq = async (endpoint, data) => {
    return axios.post(`https://atlantich2h.com${endpoint}`, qs.stringify({
        api_key: API_KEY,
        ...data
    }), { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
    });
};

// --- ROUTES API ---

// 1. Create QRIS
app.post('/api/create', async (req, res) => {
    try {
        const { nominal } = req.body;
        
        console.log(`[LOG] Mencoba membuat QRIS nominal: ${nominal}`);

        const response = await atlanticReq('/deposit/create', {
            nominal: nominal,
            reff_id: 'JARR' + Date.now(),
            type: 'ewallet', // Jika error berlanjut, coba ganti ke 'deposit'
            metode: 'qris'
        });

        // Log respon asli dari Atlantic untuk debug
        console.log("[ATLANTIC RESPONSE]:", response.data);

        if (response.data.status === false) {
            // Mengirim pesan error asli dari Atlantic (misal: "Saldo tidak cukup" atau "Minimal deposit 10.000")
            return res.status(400).json({ 
                status: false, 
                message: response.data.message || "Provider menolak permintaan." 
            });
        }
        
        res.json(response.data);
    } catch (e) {
        console.error("[SYSTEM ERROR]:", e.response?.data || e.message);
        res.status(500).json({ 
            status: false, 
            message: "Gagal terhubung ke API Atlantic. Cek koneksi/whitelist IP." 
        });
    }
});

// 2. Check Status
app.post('/api/status', async (req, res) => {
    try {
        const { id } = req.body;
        const s = await atlanticReq('/deposit/status', { id });
        
        if (s.data.data && s.data.data.status === 'success') {
            bot.telegram.sendMessage(ADMIN_ID, `✅ **PEMBAYARAN BERHASIL**\nID: ${id}\nNominal: Rp ${s.data.data.nominal}`);
        }
        res.json(s.data);
    } catch (e) {
        res.status(500).json({ status: false });
    }
});

// Jalankan Bot
bot.launch().then(() => console.log("Bot Telegram Aktif"));

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`-----------------------------------`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Pastikan IP Server sudah di Whitelist!`);
    console.log(`-----------------------------------`);
});

module.exports = app;
