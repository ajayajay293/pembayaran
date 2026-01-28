const axios = require('axios');
const qs = require('qs');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send();
    
    try {
        const { nominal } = req.body;
        const response = await axios.post('https://atlantich2h.com/deposit/create', qs.stringify({
            api_key: 'cIr6yFSfNiCtzfOw50IIb8xvviGlG4U9o7wLe60Pvrz9os0Ff0ARoAMKdNj7YyqVYi25YtfQoyGVlPo8ce3wAuawklZJlqJF6mmN',
            nominal: nominal,
            reff_id: 'WEB' + Date.now(),
            type: 'ewallet',
            metode: 'qris'
        }));
        res.status(200).json(response.data);
    } catch (e) {
        res.status(500).json({ status: false, message: e.message });
    }
}
