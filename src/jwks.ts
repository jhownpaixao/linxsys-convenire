import express from 'express';
import { readFile } from 'fs';
import { join } from 'path';

// not typed
var pem2jwk = require('pem-jwk').pem2jwk;
const app = express()
app.get('/keys', (req, res) => {
    console.log('reading')
    try {
        readFile(join('keys', '.public.key.pem'), (err, pem) => {
            if (err) { return res.status(500); }
            const jwk = pem2jwk(pem);
            return res.json({
                keys: [{
                    ...jwk,
                    kid: '220994',
                    use: 'sig'
                }]
            });
        });
        return res.status(500);
    } catch (error) {
        return res.status(500);
    }

})












app.listen(3344, () => console.log(`JWKS API is on port 3344`))