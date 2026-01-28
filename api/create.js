const axios = require('axios');
const qs = require('qs');

module.exports = async (req, res) => {
    // Memberi izin akses (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Harus menggunakan POST' });
    }

    try {
        const { nominal } = req.body;
        
        const response = await axios.post('https://atlantich2h.com/deposit/create', qs.stringify({
            api_key: 'cIr6yFSfNiCtzfOw50IIb8xvviGlG4U9o7wLe60Pvrz9os0Ff0ARoAMKdNj7YyqVYi25YtfQoyGVlPo8ce3wAuawklZJlqJF6mmN',
            nominal: nominal,
            reff_id: 'WEB' + Date.now(),
            type: 'ewallet',
            metode: 'qris'
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return res.status(200).json(response.data);
    } catch (e) {
        return res.status(500).json({ 
            status: false, 
            message: 'Error Atlantic: ' + e.message 
        });
    }
};
