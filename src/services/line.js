const line = require('@line/bot-sdk');
const { config } = require('../config');

const client = new line.Client(config.line);

module.exports = {
    client,
    replyMessage: (token, messages) => client.replyMessage(token, messages),
    pushMessage: (to, messages) => client.pushMessage(to, messages),
    getProfile: (userId) => client.getProfile(userId),
    getMessageContent: (messageId) => client.getMessageContent(messageId),
};
