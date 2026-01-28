const axios = require('axios');
const qs = require('qs');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    const { id } = req.body;
    const API_KEY = 'cIr6yFSfNiCtzfOw50IIb8xvviGlG4U9o7wLe60Pvrz9os0Ff0ARoAMKdNj7YyqVYi25YtfQoyGVlPo8ce3wAuawklZJlqJF6mmN';

    try {
        const response = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
            api_key: API_KEY,
            id: id
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        // Auto Instant jika status 'processing'
        if (response.data.data && response.data.data.status === 'processing') {
            await axios.post('https://atlantich2h.com/deposit/instant', qs.stringify({
                api_key: API_KEY,
                id: id,
                action: 'true'
            }));
        }

        res.status(200).json(response.data);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
};
