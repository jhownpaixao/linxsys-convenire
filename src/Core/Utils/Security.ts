import * as crypto from 'crypto';

export const SecurityOptions = {
    AESMethod: 'aes-256-cbc',
    initialVector: 16
};

export async function SecurityEncrypt(data: string | object): Promise<[string, Buffer]> {
    if (process.versions.openssl <= '1.0.1f') {
        throw new Error('OpenSSL Version too old, vulnerability to Heartbleed');
    }
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(SecurityOptions.initialVector);
    const cipher = crypto.createCipheriv(SecurityOptions.AESMethod, Buffer.from(key), iv);
    let encrypted = cipher.update(data as crypto.BinaryLike);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return [iv.toString('hex') + ':' + encrypted.toString('hex'), key];
}

export async function SecurityDecrypt(data: string, key: Buffer) {
    try {
        const textParts = data.split(':');
        const iv = Buffer.from(textParts.shift() as string, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(SecurityOptions.AESMethod, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        return false;
    }
}

export const GenereateUniqKey = crypto.randomUUID;
