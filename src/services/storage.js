const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Use Service Key for storage writes if RLS is strict, or Anon if public

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'audio-messages';

/**
 * Upload audio buffer to Supabase Storage
 * @param {Buffer} buffer - Audio file buffer
 * @param {string} filename - Desired filename (e.g., 'response-123.mp3')
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
const uploadAudio = async (buffer, filename) => {
    try {
        console.log(`☁️ Uploading ${filename} to Supabase...`);

        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(filename, buffer, {
                contentType: 'audio/mpeg',
                upsert: true
            });

        if (error) {
            throw error;
        }

        // Get Public URL
        const { data: publicUrlData } = supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(filename);

        console.log('☁️ Upload successful:', publicUrlData.publicUrl);
        return publicUrlData.publicUrl;

    } catch (error) {
        console.error('❌ Error uploading to Supabase:', error);
        return null;
    }
};

module.exports = { uploadAudio };
