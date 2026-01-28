const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const qs = require('qs');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Layani file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIG ---
const BOT_TOKEN = '8526480569:AAGE95lI-BO2_q6yvlwfzPqwsyUXlN6uFxc';
const API_KEY = 'cIr6yFSfNiCtzfOw50IIb8xvviGlG4U9o7wLe60Pvrz9os0Ff0ARoAMKdNj7YyqVYi25YtfQoyGVlPo8ce3wAuawklZJlqJF6mmN';
const ADMIN_ID = '7810623034';

const bot = new Telegraf(BOT_TOKEN);

const atlanticReq = async (path, data) => {
    return axios.post(`https://atlantich2h.com${path}`, qs.stringify({
        api_key: API_KEY,
        ...data
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
};

// --- ROUTES API ---

// Create QRIS
app.post('/api/create', async (req, res) => {
    try {
        const { nominal } = req.body;
        const response = await atlanticReq('/deposit/create', {
            nominal: nominal,
            reff_id: 'JARR' + Date.now(),
            type: 'ewallet',
            metode: 'qris'
        });
        
        // Kirim respon asli dari Atlantic agar kita bisa lihat pesan errornya di console browser
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
});

// Check Status
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

bot.launch();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
