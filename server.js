const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.static('public'));

// Enhanced multer configuration for audio files
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Increased to 5MB for better audio quality
        files: 1
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'audio/wav' || file.mimetype === 'audio/x-wav' || 
            file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') {
            cb(null, true);
        } else {
            cb(new Error('Only WAV/MP3 audio files are allowed'), false);
        }
    }
});

// Supported languages configuration
const SUPPORTED_LANGUAGES = {
    en: 'English',
    hi: 'Hindi',
    ml: 'Malayalam',
    ta: 'Tamil',
    te: 'Telugu',
    kn: 'Kannada',
    gu: 'Gujarati',
    pa: 'Punjabi',
    mr: 'Marathi',
    bn: 'Bangla'
};

const API_LANGUAGE_MAP = {
    'en': 'English',
    'hi': 'Hindi',
    'ml': 'Malayalam',
    'ta': 'Tamil',
    'te': 'Telugu',
    'kn': 'Kannada',
    'gu': 'Gujarati',
    'pa': 'Punjabi',
    'mr': 'Marathi',
    'bn': 'Bangla'
};

// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://api1.kissangpt.com/v1',
    ENDPOINTS: {
        TEXT: '/inference/text/web',
        AUDIO: '/inference/web'
    },
    TIMEOUT: 30000, // 30 seconds timeout
    HEADERS: {
        'accept': 'application/json',
        'origin': 'https://kissan.ai',
        'referer': 'https://kissan.ai/',
        'x-requested-with': 'XMLHttpRequest'
    }
};

// Audio optimization function
async function optimizeAudioBuffer(buffer) {
    try {
        // Convert buffer to base64 for size check
        const base64Data = buffer.toString('base64');
        if (base64Data.length > 4 * 1024 * 1024) { // ~4MB
            throw new Error('Audio file too large after optimization');
        }
        return buffer;
    } catch (error) {
        console.error('Audio optimization error:', error);
        throw error;
    }
}

// Validate language middleware
function validateLanguage(req, res, next) {
    if (!req.body.language) {
        req.body.language = 'en'; // Default to English if not specified
    }
    
    // Convert to lowercase for case-insensitive comparison
    const langCode = req.body.language.toLowerCase();
    
    if (!API_LANGUAGE_MAP[langCode]) {
        return res.status(400).json({ 
            error: `Unsupported language: ${req.body.language}`,
            supportedLanguages: Object.entries(API_LANGUAGE_MAP).map(([code, name]) => ({code, name}))
        });
    }
    
    // Standardize the language code before proceeding
    req.body.language = langCode;
    next();
}

// Get supported languages endpoint
app.get('/api/languages', (req, res) => {
    res.json({
        supportedLanguages: SUPPORTED_LANGUAGES
    });
});

// Proxy endpoint with enhanced audio handling
app.post('/api/kissangpt', upload.single('audio'), validateLanguage, async (req, res) => {
    try {
        const isAudio = !!req.file;
        const endpoint = isAudio ? API_CONFIG.ENDPOINTS.AUDIO : API_CONFIG.ENDPOINTS.TEXT;
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;

        const form = new FormData();

        const langCode = req.body.language.toLowerCase();
        const apiLanguage = API_LANGUAGE_MAP[langCode] || 'English';
        
        // Required fields for both text and audio
        form.append('language', apiLanguage); // Default to English
        form.append('question_prev', req.body.question_prev || '');
        form.append('answer_prev', req.body.answer_prev || '');
        
        if (isAudio) {
            // Optimize audio before sending
            const optimizedBuffer = await optimizeAudioBuffer(req.file.buffer);
            form.append('audio', optimizedBuffer, {
                filename: 'audio.wav',
                contentType: req.file.mimetype,
                knownLength: optimizedBuffer.length
            });
        } else {
            // Text request fields
            form.append('question', req.body.question || '');
            form.append('question_en', req.body.question_en || req.body.question || '');
        }

        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
                ...API_CONFIG.HEADERS
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: API_CONFIG.TIMEOUT
        });

        // Add language information to response
        const responseData = response.data;
        responseData.language = req.body.language || 'en';
        responseData.languageName = SUPPORTED_LANGUAGES[responseData.language] || 'English';

        res.json(responseData);

    } catch (error) {
        console.error('API Error:', error);
        
        let status = 500;
        let message = 'Internal Server Error';
        
        if (error.response) {
            status = error.response.status;
            message = error.response.data?.error || error.response.statusText;
        } else if (error.code === 'ECONNABORTED') {
            status = 504;
            message = 'Request timeout - the server took too long to respond';
        } else if (error.message.includes('too large')) {
            status = 413;
            message = 'File size too large. Maximum 5MB for audio files.';
        } else {
            message = error.message;
        }

        res.status(status).json({ 
            error: message,
            details: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
            error: 'File upload error',
            message: err.message 
        });
    }
    next(err);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Supported languages:', Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => `${code}: ${name}`).join(', '));
});