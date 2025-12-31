/**
 * LLM Service
 * 
 * Unified interface for LLM calls across all agents.
 * Uses Groq (free tier) by default.
 */

const Groq = require('groq-sdk');
const logger = require('./logger').createAgentLogger('llm');

class LLMService {
    constructor() {
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
        this.model = 'llama-3.3-70b-versatile';
    }

    async generate(prompt, options = {}) {
        const {
            systemPrompt = 'You are a helpful AI assistant.',
            temperature = 0.7,
            maxTokens = 500,
        } = options;

        try {
            logger.debug('Generating response', { promptLength: prompt.length });

            const completion = await this.groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt },
                ],
                model: this.model,
                temperature,
                max_tokens: maxTokens,
            });

            const response = completion.choices[0]?.message?.content || '';
            logger.debug('Response generated', { responseLength: response.length });

            return response;
        } catch (error) {
            logger.error('LLM generation failed', { error: error.message });
            throw error;
        }
    }

    async generateJSON(prompt, options = {}) {
        const response = await this.generate(prompt, {
            ...options,
            systemPrompt: `${options.systemPrompt || 'You are a helpful AI assistant.'}\n\nIMPORTANT: Respond ONLY with valid JSON. No other text.`,
        });

        try {
            return JSON.parse(response);
        } catch (error) {
            logger.error('Failed to parse JSON response', { response });
            throw new Error('LLM did not return valid JSON');
        }
    }
}

module.exports = new LLMService();
