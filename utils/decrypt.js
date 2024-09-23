import crypto from 'crypto';

// The key and IV used in Dart
const myKey = 'ibrahimsiker1023';
const myIv = '0123456789abcdef';

// Hash the key and IV using SHA-256 like Dart
const keyHash = crypto.createHash('sha256').update(myKey, 'utf8').digest('hex').substring(0, 32);
const ivHash = crypto.createHash('sha256').update(myIv, 'utf8').digest('hex').substring(0, 16);

// Export the decrypt function
function decrypt(encryptedBase64) {
    const key = Buffer.from(keyHash, 'utf8');
    const iv = Buffer.from(ivHash, 'utf8');
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    // Decrypt the base64-encoded value
    let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}


export default decrypt
