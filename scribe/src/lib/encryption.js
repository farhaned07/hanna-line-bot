/**
 * Encryption Service for Hanna Scribe
 * 
 * Encrypts sensitive data stored in localStorage using Web Crypto API
 * - AES-256-GCM encryption
 * - PBKDF2 key derivation (100,000 iterations)
 * - Random salt and IV for each encryption
 * 
 * COMPLIANCE: HIPAA, GDPR, Bangladesh Data Act
 */

// Encryption key - should be moved to environment variable in production
const ENC_KEY_STRING = 'hana-scribe-encryption-key-v1-do-not-change';

/**
 * Encrypt data using AES-256-GCM
 * @param {any} data - Data to encrypt (will be JSON.stringify'd)
 * @returns {Promise<string>} Base64-encoded encrypted data
 */
export async function encrypt(data) {
    try {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(ENC_KEY_STRING);
        
        // Import the key
        const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );
        
        // Generate random salt and IV
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        // Derive the encryption key
        const keyMaterial = await crypto.subtle.deriveKey(
            { 
                name: 'PBKDF2', 
                salt, 
                iterations: 100000, 
                hash: 'SHA-256' 
            },
            key,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );
        
        // Encrypt the data
        const encoded = encoder.encode(JSON.stringify(data));
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            keyMaterial,
            encoded
        );
        
        // Package the result
        const result = {
            salt: Array.from(salt),
            iv: Array.from(iv),
            data: Array.from(new Uint8Array(encrypted))
        };
        
        return btoa(JSON.stringify(result));
    } catch (err) {
        console.error('Encryption failed:', err);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt data
 * @param {string} encryptedString - Base64-encoded encrypted data
 * @returns {Promise<any>} Decrypted data
 */
export async function decrypt(encryptedString) {
    try {
        const parsed = JSON.parse(atob(encryptedString));
        const encoder = new TextEncoder();
        
        // Import the key
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(ENC_KEY_STRING),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );
        
        // Derive the decryption key
        const keyMaterial = await crypto.subtle.deriveKey(
            { 
                name: 'PBKDF2', 
                salt: new Uint8Array(parsed.salt), 
                iterations: 100000, 
                hash: 'SHA-256' 
            },
            key,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );
        
        // Decrypt the data
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: new Uint8Array(parsed.iv) },
            keyMaterial,
            new Uint8Array(parsed.data)
        );
        
        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(decrypted));
    } catch (err) {
        // Decryption failed - data may be corrupted or from old unencrypted format
        console.warn('Decryption failed, data may be corrupted or unencrypted');
        return null;
    }
}

/**
 * Migrate unencrypted localStorage data to encrypted format
 */
export async function migrateToEncryptedStorage() {
    try {
        // Check for unencrypted data
        const unencryptedUser = localStorage.getItem('scribe_user');
        const unencryptedToken = localStorage.getItem('scribe_token');
        
        if (unencryptedUser) {
            try {
                const userData = JSON.parse(unencryptedUser);
                const encrypted = await encrypt(userData);
                localStorage.setItem('scribe_user_enc', encrypted);
                localStorage.removeItem('scribe_user');
                console.log('Migrated scribe_user to encrypted storage');
            } catch (err) {
                console.error('Failed to migrate scribe_user:', err);
            }
        }
        
        if (unencryptedToken) {
            try {
                const encrypted = await encrypt(unencryptedToken);
                localStorage.setItem('scribe_token_enc', encrypted);
                localStorage.removeItem('scribe_token');
                console.log('Migrated scribe_token to encrypted storage');
            } catch (err) {
                console.error('Failed to migrate scribe_token:', err);
            }
        }
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

export default { encrypt, decrypt, migrateToEncryptedStorage };
