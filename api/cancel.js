const axios = require('axios');
const qs = require('qs');

export default async function handler(req, res) {
    // Memastikan hanya request POST yang diterima
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ status: false, message: 'Transaction ID is required' });
    }

    try {
        const response = await axios.post('https://atlantich2h.com/deposit/cancel', qs.stringify({
            api_key: 'cIr6yFSfNiCtzfOw50IIb8xvviGlG4U9o7wLe60Pvrz9os0Ff0ARoAMKdNj7YyqVYi25YtfQoyGVlPo8ce3wAuawklZJlqJF6mmN',
            id: id
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // Mengirimkan respon balik dari Atlantic ke Frontend
        res.status(200).json(response.data);
    } catch (e) {
        console.error("Cancel Error:", e.message);
        res.status(500).json({ 
            status: false, 
            message: 'Gagal membatalkan pesanan di server Atlantic.' 
        });
    }
}
