// Lazy-load LiveKit only when needed to prevent Railway build failures
let AccessToken = null;

const API_KEY = process.env.LIVEKIT_API_KEY || 'devkey';
const API_SECRET = process.env.LIVEKIT_API_SECRET || 'secret';
const WS_URL = process.env.LIVEKIT_URL || 'wss://hanna-test.livekit.cloud';

// Check if LiveKit is configured
const isLiveKitConfigured = () => {
    return !!(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET);
};

/**
 * Generate a LiveKit Access Token for a user (or the Agent)
 * @param {string} participantName - Display name (e.g. User ID or "Hanna")
 * @param {string} roomName - The room to join
 * @param {boolean} isAgent - If true, gives hidden/admin privileges if needed
 */
async function generateToken(participantName, roomName, isAgent = false) {
    // Lazy load only when actually called
    if (!AccessToken) {
        if (!isLiveKitConfigured()) {
            throw new Error('LiveKit is not configured. Please set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET environment variables.');
        }
        AccessToken = require('livekit-server-sdk').AccessToken;
    }

    const at = new AccessToken(API_KEY, API_SECRET, {
        identity: participantName,
        name: participantName,
    });

    at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
    });

    return await at.toJwt();
}

module.exports = {
    generateToken,
    WS_URL
};
