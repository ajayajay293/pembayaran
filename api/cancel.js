const axios = require('axios');
const qs = require('qs');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.body;
    try {
        const response = await axios.post('https://atlantich2h.com/deposit/cancel', qs.stringify({
            api_key: 'cIr6yFSfNiCtzfOw50IIb8xvviGlG4U9o7wLe60Pvrz9os0Ff0ARoAMKdNj7YyqVYi25YtfQoyGVlPo8ce3wAuawklZJlqJF6mmN',
            id: id
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        res.status(200).json(response.data);
    } catch (e) {
        res.status(500).json({ status: false });
    }
};
