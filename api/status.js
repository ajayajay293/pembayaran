const axios = require('axios');
const qs = require('qs');

export default async function handler(req, res) {
    const { id } = req.body;
    try {
        const response = await axios.post('https://atlantich2h.com/deposit/status', qs.stringify({
            api_key: 'cIr6yFSfNiCtzfOw50IIb8xvviGlG4U9o7wLe60Pvrz9os0Ff0ARoAMKdNj7YyqVYi25YtfQoyGVlPo8ce3wAuawklZJlqJF6mmN',
            id: id
        }));
        
        // Auto instant jika processing
        if (response.data.data.status === 'processing') {
            await axios.post('https://atlantich2h.com/deposit/instant', qs.stringify({
                api_key: 'cIr6yFSfNiCtzfOw50IIb8xvviGlG4U9o7wLe60Pvrz9os0Ff0ARoAMKdNj7YyqVYi25YtfQoyGVlPo8ce3wAuawklZJlqJF6mmN',
                id: id, action: 'true'
            }));
        }
        
        res.status(200).json(response.data);
    } catch (e) {
        res.status(500).json({ status: false });
    }
}
