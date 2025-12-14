const { AccessToken } = require('livekit-server-sdk');

const API_KEY = process.env.LIVEKIT_API_KEY || 'devkey';
const API_SECRET = process.env.LIVEKIT_API_SECRET || 'secret';
const WS_URL = process.env.LIVEKIT_URL || 'wss://hanna-test.livekit.cloud';

/**
 * Generate a LiveKit Access Token for a user (or the Agent)
 * @param {string} participantName - Display name (e.g. User ID or "Hanna")
 * @param {string} roomName - The room to join
 * @param {boolean} isAgent - If true, gives hidden/admin privileges if needed
 */
async function generateToken(participantName, roomName, isAgent = false) {
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
