import * as fs from 'fs'
import * as jose from 'node-jose'
import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';
import ms from 'ms'
dotenv.config();


const port = process.env.BACKEND_AUTHENTICATOR_PORT || 3302
const host = process.env.BACKEND_URL || 'http://localhost';

const SecretKey = process.env.SECURITY_JWT_SECRET || 'REVAMER336aexCx000'
const AuthIssuer = `${host}:${port}/LinxSys-EarlyAuth?&version=1.0`
const AuthPasspharse = process.env.SECURITY_JWT_PASSPHARSE || 'CryptEARLYENV87'
const KeyPath = path.resolve(__dirname, './keys');
const KeyStoreFile = path.join(KeyPath, 'keys.json')

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const keyStore = jose.JWK.createKeyStore();

keyStore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' }).then(result => {

    fs.writeFileSync(
        KeyStoreFile,
        JSON.stringify(keyStore.toJSON(true), null, '  ')
    )
})


app.get('/keys', async (req, res) => {
    const ks = fs.readFileSync(KeyStoreFile)
    const keyStore = await jose.JWK.asKeyStore(ks.toString())
    res.send(keyStore.toJSON())
})

app.post('/sign', async (req, res) => {
    const ks = fs.readFileSync(KeyStoreFile)
    const keyStore = await jose.JWK.asKeyStore(ks.toString())
    const [key] = keyStore.all({ use: 'sig' })

    const opt = { compact: true, jwk: key, fields: { typ: 'jwt' } }
    const payload = JSON.stringify({
        exp: Math.floor((Date.now() + ms('1d')) / 1000),
        iat: Math.floor(Date.now() / 1000),
        iss: AuthIssuer,
        ...req.body
    })
    const token = await jose.JWS.createSign(opt, key)
        .update(payload, "utf8")
        .final()
    res.send({ token })
})


app.get('/add', async (req, res) => {
    const ks = fs.readFileSync(KeyStoreFile)
    const keyStore = await jose.JWK.asKeyStore(ks.toString())
    await keyStore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' })
    const json: any = keyStore.toJSON(true)
    json.keys = json.keys.reverse()
    fs.writeFileSync(KeyStoreFile, JSON.stringify(json, null, '  '))
    res.send(keyStore.toJSON())
})

app.get('/del', async (req, res) => {
    const ks = JSON.parse(fs.readFileSync(KeyStoreFile).toString())
    if (ks.keys.length > 1) ks.keys.pop()
    fs.writeFileSync('keys1.json', JSON.stringify(ks, null, ' '))
    const keyStore = await jose.JWK.asKeyStore(JSON.stringify(ks))
    res.send(keyStore.toJSON())
})


console.log('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓███████████████████▓░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▓██▒░░░░░░░░░░░░░░▒▒░░░░░░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▒▒▒░░░░▒▒░▒▒▓▓▓▒░░░░▓██▓░░░░░░▒▒▒░░░▒▒▒░░░░░░░░░▒▒░░░░░░░░░░░░░░░░░░░░░▒▒▒▒░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓██▓▓▓███▓░░░▒███░░░░▓██░░░░░▒▒▒░░░░░░░░░░░░░░▒▒░░░░░░░▒▒▒░░░▒▒▒▒░▒▒▒▒░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓██▒░░░░░▓██▒░░░░▓██▒▒██▓░░░░░░░░▒▒▒▒▒▒▒▒░░░░░░░░▒▒░░░░░░▒▒░░░▒▒░░░░░░░▒░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓██░░░░░░▒██▒░░░░░▒████▒░░░░░░░░░░░░░░░▒▒▒▒▒░░░░░░▒▒░░░░▒▒░░░░░▒▒▒▒▒▒░░░░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░░░░▓███▒░░░░░░░░░░░░░░░░░░▒▒▒░░░░░▒▒░░░▒▒▒░░░░░░░▒▒▒▒▒▒▒░░░░')
console.log('░░░██▓░░░░░░░░░░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░░▒██▒▒██▓░░░░░▒▒░░░░░░░░░░░▒▒░░░░░░▒▒░▒▒▒░░░░░░░░░░░░░▒▒▒░░░')
console.log('░░░███▒▒▒▒▒▒▒▒▒░░░▓█▓░░░▓█▓░░░░░░▒██▒░░░▓██▒░░░▓█▓░░░░░▒▒▒▒░░░░░░▒▒▒░░░░░░░▒▒▒▒▒░░░░░░▒▒▒░░░░░▒▒▒░░░')
console.log('░░░████████████▒░░▓█▓░░░▒█▓░░░░░░▒██▒░▒██▓░░░░░░▓█▓░░░░░░▒▒▒▒▒▒▒▒▒░░░░░░░░░░▒▒▒░░░░░░░░░▒▒▒▒▒▒▒░░░░░')
console.log('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░▒░░░░░▒░▒░░░▒░░░░▒░░░░░░░░░░░░▒▒▒░░░▒░░░░░▒░░░░░░░░░░░▒░░▒░░░░░▒░░░░░░░▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░')
console.log('░░░▒▒░░░▒░░▒░░░▒░░░░▒░▒░░░▒░░░░░░▒░▒░░░▓▒░░░░▒▒▒░░░░▒▒▒░░▒▒▒▒░░░░░▓░░▒░░░▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░')
console.log(' ')

app.listen(port, () => console.log(`⚡ Servidor de AUTÊNTICAÇÃO Iniciado| 🌍 ${host}:${port}`))