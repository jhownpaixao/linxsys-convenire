import * as crypto from 'crypto'


export const SecurityOptions = {
    AESMethod: 'aes-256-cbc',
    initialVector: 16
}

export async function SecurityEncrypt(data: any): Promise<[string, Buffer]> {
    if (process.versions.openssl <= '1.0.1f') {
        throw new Error('OpenSSL Version too old, vulnerability to Heartbleed')
    }
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(SecurityOptions.initialVector);
    const cipher = crypto.createCipheriv(SecurityOptions.AESMethod, Buffer.from(key), iv);
    let encrypted = cipher.update(data);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return [iv.toString('hex') + ':' + encrypted.toString('hex'), key];
}

export async function SecurityDecrypt(data: any, key: Buffer) {
    try {
        let textParts = data.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv(SecurityOptions.AESMethod, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        return false;
    }

}

export const GenereateUniqKey = crypto.randomUUID;

