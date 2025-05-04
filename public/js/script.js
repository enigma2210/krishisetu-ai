// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`.tab-button:nth-child(${tabName === 'text' ? 1 : 2})`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Audio recording functionality
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

async function toggleRecording() {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                document.getElementById('submitAudio').disabled = false;
                document.getElementById('recordingStatus').textContent = 'Recording complete. Ready to submit.';
            };
            
            audioChunks = [];
            mediaRecorder.start();
            isRecording = true;
            
            document.getElementById('recordButton').classList.add('recording');
            document.getElementById('recordText').textContent = 'Stop Recording';
            document.getElementById('recordingStatus').textContent = 'Recording... Speak now';
            
            // Auto-stop after 60 seconds
            setTimeout(() => {
                if (isRecording) {
                    toggleRecording();
                    showError('Recording automatically stopped after 60 seconds');
                }
            }, 60000);
        } catch (error) {
            showError('Error accessing microphone: ' + error.message);
        }
    } else {
        mediaRecorder.stop();
        isRecording = false;
        
        document.getElementById('recordButton').classList.remove('recording');
        document.getElementById('recordText').textContent = 'Start Recording';
    }
}

// Text submission
async function submitText() {
    const text = document.getElementById('textInput').value.trim();
    const language = currentLanguage; // Using the selected language from language selector
    
    if (!text) {
        showError('Please enter a question');
        return;
    }
    
    // Prepare form data with ALL required fields
    const formData = new FormData();
    formData.append('language', currentLanguage);
    formData.append('question_prev', ''); // Explicitly empty but required
    formData.append('answer_prev', '');   // Explicitly empty but required
    formData.append('question', text);
    formData.append('question_en', text); // Using same text for English
    
    callKissanAPI(formData);
}

// Audio submission
async function submitAudio() {
    if (audioChunks.length === 0) {
        showError('No recording available');
        return;
    }
    
    try {
        const maxDuration = 30000; // 30 seconds in ms
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

        // Verify duration
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        if (audioBuffer.duration > 30) { // 30 seconds max
            showError('Recording too long (max 30 seconds)');
            return;
        }

        // Using the selected language from language selector
        const language = currentLanguage;

        // Prepare form data with all required fields
        const formData = new FormData();
        formData.append('language', currentLanguage);
        formData.append('question_prev', '');
        formData.append('answer_prev', '');
        formData.append('audio', audioBlob, 'audio.wav');

        callKissanAPI(formData);

    }  catch (error) {
        showError('Error processing audio: ' + error.message);
        console.error('Audio processing error:', error);
    }
}

// API call function
async function callKissanAPI(payload) {
    const apiStatus = document.getElementById('apiStatus');
    const errorMessage = document.getElementById('errorMessage');
    const responseSection = document.getElementById('responseSection');
    const textResponse = document.getElementById('textResponse');
    const audioResponse = document.getElementById('audioResponse');
    const translations = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    
    // Reset UI
    apiStatus.textContent = translations.apiStatusSending || 'Sending request...';
    errorMessage.textContent = '';
    responseSection.style.display = 'none';
    audioResponse.src = '';
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch('/api/kissangpt', {
            method: 'POST',
            body: payload,
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display response
        responseSection.style.display = 'block';
        textResponse.innerHTML = '';
        
        // Formatting function for responses
        const formatResponse = (text) => {
            if (!text) return '';
            return text
                .replace(/### (.*?)(\n|$)/g, '<h3>$1</h3>')
                .replace(/#### (.*?)(\n|$)/g, '<h4>$1</h4>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/- (.*?)(\n|$)/g, '<li>$1</li>')
                .replace(/\n/g, '<br>')
                .replace(/<li>/g, '<ul><li>')
                .replace(/<\/li>/g, '</li></ul>')
                .replace(/<\/ul><br><ul>/g, '');
        };

        if (data.audio) {
            audioResponse.src = 'data:audio/wav;base64,' + data.audio;
            audioResponse.style.display = 'block';
            textResponse.innerHTML = `
                <p><strong>${translations.questionLabel || 'Question'}:</strong> ${data.question || translations.audioQuestion || 'Audio question'}</p>
            `;
        } else {
            textResponse.innerHTML = `
                <div class="question-section">
                    <p><strong>${translations.questionLabel || 'Question'}:</strong> ${data.question || ''}</p>
                </div>
                <div class="answer-section">
                    <p><strong>${translations.responseLabel || 'Response'}:</strong></p>
                    <div class="formatted-response">${formatResponse(data.answer)}</div>
                </div>
                ${data.answer_en ? `
                <div class="answer-section english-response">
                    <p><strong>${translations.responseEnLabel || 'Response (English)'}:</strong></p>
                    <div class="formatted-response">${formatResponse(data.answer_en)}</div>
                </div>` : ''}
            `;
            audioResponse.style.display = 'none';
        }
        
        apiStatus.textContent = translations.apiStatusSuccess || 'Response received successfully';
    } catch (error) {
        if (error.name === 'AbortError') {
            showError(translations.errorTimeout || 'Request timed out (30s) - please try a shorter recording');
        } else {
            showError(`${translations.errorPrefix || 'Error'}: ${error.message}`);
        }
        apiStatus.textContent = translations.apiStatusFailed || 'Request failed';
        console.error('API Error:', error);
    }
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
}

// Language Selection Functionality
const languages = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        audioSupport: true,
        textSupport: true,
        iconClass: 'fas fa-language'
    },
    {
        code: 'hi',
        name: 'Hindi',
        nativeName: 'हिन्दी',
        audioSupport: true,
        textSupport: true,
        iconClass: 'fas fa-om'
    },
    {
        code: 'ml',
        name: 'Malayalam',
        nativeName: 'മലയാളം',
        audioSupport: true,
        textSupport: true,
        iconClass: 'fas fa-'
    },
    {
        code: 'ta',
        name: 'Tamil',
        nativeName: 'தமிழ்',
        audioSupport: true,
        textSupport: true,
        iconClass: 'fas fa-'
    },
    {
        code: 'te',
        name: 'Telugu',
        nativeName: 'తెలుగు',
        audioSupport: true,
        textSupport: true,
        iconClass: 'fas fa-'
    },
    {
        code: 'kn',
        name: 'Kannada',
        nativeName: 'ಕನ್ನಡ',
        audioSupport: true,
        textSupport: true,
        iconClass: 'fas fa-'
    },
    {
        code: 'gu',
        name: 'Gujarati',
        nativeName: 'ગુજરાતી',
        audioSupport: true,
        textSupport: true,
        iconClass: 'fas fa-'
    },
    {
        code: 'pa',
        name: 'Punjabi',
        nativeName: 'ਪੰਜਾਬੀ',
        audioSupport: true,
        textSupport: true,
        iconClass: 'fas fa-'
    },
    {
        code: 'mr',
        name: 'Marathi',
        nativeName: 'मराठी',
        audioSupport: true,
        textSupport: true,
        iconClass: 'fas fa-'
    },
    {
        code: 'bn',
        name: 'Bangla',
        nativeName: 'বাংলা',
        audioSupport: true,
        textSupport: true,
        iconClass: 'fas fa-'
    }
];

const UI_TRANSLATIONS = {
    en: {
        title: "KrishiSetu: Multilingual Q&A Portal",
        subtitle: "Get answers in your preferred language via text or voice",
        textTab: "Text Input",
        voiceTab: "Voice Input",
        textPlaceholder: "Type your question here...",
        submitText: "Submit",
        recordButton: "Start Recording",
        submitAudio: "Submit Recording",
        recordingStatus: "Ready to record",
        responseTitle: "Response",
        questionLabel: "Question",
        responseLabel: "Response",
        responseEnLabel: "Response (English)",
        audioQuestion: "Audio question",
        apiStatusSending: "Sending request...",
        apiStatusSuccess: "Response received successfully",
        apiStatusFailed: "Request failed",
        errorTimeout: "Request timed out (30s) - please try a shorter recording",
        errorPrefix: "Error",
        footer: "© 2023 Multilingual Q&A Portal. All rights reserved."
    },
    hi: {
        title: "कृषिसेतु: बहुभाषी प्रश्नोत्तर पोर्टल",
        subtitle: "पाठ या आवाज के माध्यम से अपनी पसंदीदा भाषा में उत्तर प्राप्त करें",
        textTab: "पाठ इनपुट",
        voiceTab: "आवाज इनपुट",
        textPlaceholder: "अपना प्रश्न यहाँ टाइप करें...",
        submitText: "प्रस्तुत करें",
        recordButton: "रिकॉर्डिंग शुरू करें",
        submitAudio: "रिकॉर्डिंग प्रस्तुत करें",
        recordingStatus: "रिकॉर्ड करने के लिए तैयार",
        responseTitle: "प्रतिक्रिया",
        questionLabel: "प्रश्न",
        responseLabel: "उत्तर",
        responseEnLabel: "उत्तर (अंग्रेज़ी)",
        audioQuestion: "ऑडियो प्रश्न",
        apiStatusSending: "अनुरोध भेजा जा रहा है...",
        apiStatusSuccess: "उत्तर सफलतापूर्वक प्राप्त हुआ",
        apiStatusFailed: "अनुरोध विफल",
        errorTimeout: "अनुरोध समय समाप्त (30s) - कृपया छोटी रिकॉर्डिंग आज़माएँ",
        errorPrefix: "त्रुटि",
        footer: "© 2023 बहुभाषी प्रश्नोत्तर पोर्टल। सर्वाधिकार सुरक्षित।"
    },
    ml: {
        title: "കൃഷിസേതു: മൾട്ടിലിംഗൽ ചോദ്യോത്തര പോർട്ടൽ",
        subtitle: "ടെക്സ്റ്റ് അല്ലെങ്കിൽ വോയ്സ് വഴി നിങ്ങൾക്ക് ഇഷ്ടമുള്ള ഭാഷയിൽ ഉത്തരങ്ങൾ നേടുക",
        textTab: "ടെക്സ്റ്റ് ഇൻപുട്ട്",
        voiceTab: "വോയ്സ് ഇൻപുട്ട്",
        textPlaceholder: "നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക...",
        submitText: "സമർപ്പിക്കുക",
        recordButton: "റെക്കോർഡിംഗ് ആരംഭിക്കുക",
        submitAudio: "റെക്കോർഡിംഗ് സമർപ്പിക്കുക",
        recordingStatus: "റെക്കോർഡ് ചെയ്യാൻ തയ്യാറാണ്",
        responseTitle: "പ്രതികരണം",
        questionLabel: "ചോദ്യം",
        responseLabel: "പ്രതികരണം",
        responseEnLabel: "പ്രതികരണം (ഇംഗ്ലീഷ്)",
        audioQuestion: "ഓഡിയോ ചോദ്യം",
        apiStatusSending: "അഭ്യർത്ഥന അയയ്ക്കുന്നു...",
        apiStatusSuccess: "പ്രതികരണം വിജയകരമായി ലഭിച്ചു",
        apiStatusFailed: "അഭ്യർത്ഥന പരാജയപ്പെട്ടു",
        errorTimeout: "അഭ്യർത്ഥന സമയം കഴിഞ്ഞു (30s) - ദയവായി ഒരു ചെറിയ റെക്കോർഡിംഗ് ശ്രമിക്കുക",
        errorPrefix: "പിശക്",
        footer: "© 2023 മൾട്ടിലിംഗൽ ചോദ്യോത്തര പോർട്ടൽ. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം."
    },
    ta: {
        title: "கிருஷி சேது: பல மொழி கேள்வி-பதில் போர்டல்",
        subtitle: "உரை அல்லது குரல் மூலம் உங்கள் விருப்பமான மொழியில் பதில்களைப் பெறவும்",
        textTab: "உரை உள்ளீடு",
        voiceTab: "குரல் உள்ளீடு",
        textPlaceholder: "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்க...",
        submitText: "சமர்ப்பிக்கவும்",
        recordButton: "பதிவைத் தொடங்கு",
        submitAudio: "பதிவை சமர்ப்பிக்கவும்",
        recordingStatus: "பதிவு செய்ய தயார்",
        responseTitle: "பதில்",
        questionLabel: "கேள்வி",
        responseLabel: "பதில்",
        responseEnLabel: "பதில் (ஆங்கிலம்)",
        audioQuestion: "ஒலி கேள்வி",
        apiStatusSending: "கோரிக்கை அனுப்பப்படுகிறது...",
        apiStatusSuccess: "பதில் வெற்றிகரமாக பெறப்பட்டது",
        apiStatusFailed: "கோரிக்கை தோல்வியுற்றது",
        errorTimeout: "கோரிக்கை நேரம் முடிந்துவிட்டது (30s) - தயவுசெய்து குறுகிய பதிவை முயற்சிக்கவும்",
        errorPrefix: "பிழை",
        footer: "© 2023 பல மொழி கேள்வி-பதில் போர்டல். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
    },
    te: {
        title: "కృషిసేతు: బహుభాషా ప్రశ్న-జవాబు పోర్టల్",
        subtitle: "టెక్స్ట్ లేదా వాయిస్ ద్వారా మీకు ఇష్టమైన భాషలో సమాధానాలు పొందండి",
        textTab: "టెక్స్ట్ ఇన్పుట్",
        voiceTab: "వాయిస్ ఇన్పుట్",
        textPlaceholder: "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...",
        submitText: "సమర్పించండి",
        recordButton: "రికార్డింగ్ ప్రారంభించండి",
        submitAudio: "రికార్డింగ్ సమర్పించండి",
        recordingStatus: "రికార్డ్ చేయడానికి సిద్ధంగా ఉంది",
        responseTitle: "ప్రతిస్పందన",
        questionLabel: "ప్రశ్న",
        responseLabel: "స్పందన",
        responseEnLabel: "స్పందన (ఆంగ్లం)",
        audioQuestion: "ఆడియో ప్రశ్న",
        apiStatusSending: "అభ్యర్థన పంపబడుతోంది...",
        apiStatusSuccess: "స్పందన విజయవంతంగా అందింది",
        apiStatusFailed: "అభ్యర్థన విఫలమైంది",
        errorTimeout: "అభ్యర్థన సమయం ముగిసింది (30s) - దయచేసి చిన్న రికార్డింగ్‌ను ప్రయత్నించండి",
        errorPrefix: "లోపం",
        footer: "© 2023 బహుభాషా ప్రశ్న-జవాబు పోర్టల్. అన్ని హక్కులు ప్రత్యేకించబడినవి."
    },
    kn: {
        title: "ಕೃಷಿ ಸೇತು: ಬಹುಭಾಷಾ ಪ್ರಶ್ನೋತ್ತರ ಪೋರ್ಟಲ್",
        subtitle: "ಪಠ್ಯ ಅಥವಾ ಧ್ವನಿ ಮೂಲಕ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ",
        textTab: "ಪಠ್ಯ ಇನ್ಪುಟ್",
        voiceTab: "ಧ್ವನಿ ಇನ್ಪುಟ್",
        textPlaceholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
        submitText: "ಸಲ್ಲಿಸು",
        recordButton: "ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
        submitAudio: "ರೆಕಾರ್ಡಿಂಗ್ ಸಲ್ಲಿಸಿ",
        recordingStatus: "ರೆಕಾರ್ಡ್ ಮಾಡಲು ಸಿದ್ಧವಾಗಿದೆ",
        responseTitle: "ಪ್ರತಿಕ್ರಿಯೆ",
        questionLabel: "ಪ್ರಶ್ನೆ",
        responseLabel: "ಪ್ರತಿಕ್ರಿಯೆ",
        responseEnLabel: "ಪ್ರತಿಕ್ರಿಯೆ (ಇಂಗ್ಲಿಷ್)",
        audioQuestion: "ಆಡಿಯೋ ಪ್ರಶ್ನೆ",
        apiStatusSending: "ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...",
        apiStatusSuccess: "ಪ್ರತಿಕ್ರಿಯೆ ಯಶಸ್ವಿಯಾಗಿ ಪಡೆಯಲಾಗಿದೆ",
        apiStatusFailed: "ವಿನಂತಿ ವಿಫಲವಾಗಿದೆ",
        errorTimeout: "ವಿನಂತಿ ಸಮಯ ಮೀರಿದೆ (30s) - ದಯವಿಟ್ಟು ಕಡಿಮೆ ಸಮಯದ ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಯತ್ನಿಸಿ",
        errorPrefix: "ದೋಷ",
        footer: "© 2023 ಬಹುಭಾಷಾ ಪ್ರಶ್ನೋತ್ತರ ಪೋರ್ಟಲ್. ಎಲ್ಲ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲ್ಪಟ್ಟಿವೆ."
    },
    gu: {
        title: "કૃષિસેતુ: મલ્ટીલિંગ્વલ પ્રશ્ન-જવાબ પોર્ટલ",
        subtitle: "ટેક્સ્ટ અથવા વૉઇસ દ્વારા તમારી પસંદગીની ભાષામાં જવાબો મેળવો",
        textTab: "ટેક્સ્ટ ઇનપુટ",
        voiceTab: "વૉઇસ ઇનપુટ",
        textPlaceholder: "તમારો પ્રશ્ન અહીં લખો...",
        submitText: "સબમિટ કરો",
        recordButton: "રેકોર્ડિંગ શરૂ કરો",
        submitAudio: "રેકોર્ડિંગ સબમિટ કરો",
        recordingStatus: "રેકોર્ડ કરવા માટે તૈયાર છે",
        responseTitle: "જવાબ",
        questionLabel: "પ્રશ્ન",
        responseLabel: "જવાબ",
        responseEnLabel: "જવાબ (અંગ્રેજી)",
        audioQuestion: "ઑડિયો પ્રશ્ન",
        apiStatusSending: "રિક્વેસ્ટ મોકલી રહ્યા છીએ...",
        apiStatusSuccess: "જવાબ સફળતાપૂર્વક મળ્યો",
        apiStatusFailed: "રિક્વેસ્ટ નિષ્ફળ",
        errorTimeout: "રિક્વેસ્ટ ટાઇમઆઉટ (30s) - મહેરબાની કરીને ટૂંકી રેકોર્ડિંગ અજમાવો",
        errorPrefix: "ભૂલ",
        footer: "© 2023 મલ્ટીલિંગ્વલ પ્રશ્ન-જવાબ પોર્ટલ. બધા હક્કો અનામત."
    },
    pa: {
        title: "ਕ੍ਰਿਸ਼ੀ ਸੇਤੂ: ਮਲਟੀਲਿੰਗੁਅਲ ਪ੍ਰਸ਼ਨ-ਉੱਤਰ ਪੋਰਟਲ",
        subtitle: "ਟੈਕਸਟ ਜਾਂ ਆਵਾਜ਼ ਰਾਹੀਂ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਵਿੱਚ ਜਵਾਬ ਪ੍ਰਾਪਤ ਕਰੋ",
        textTab: "ਟੈਕਸਟ ਇਨਪੁੱਟ",
        voiceTab: "ਵੌਇਸ ਇਨਪੁੱਟ",
        textPlaceholder: "ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਟਾਈਪ ਕਰੋ...",
        submitText: "ਜਮ੍ਹਾਂ ਕਰੋ",
        recordButton: "ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ",
        submitAudio: "ਰਿਕਾਰਡਿੰਗ ਜਮ੍ਹਾਂ ਕਰੋ",
        recordingStatus: "ਰਿਕਾਰਡ ਕਰਨ ਲਈ ਤਿਆਰ",
        responseTitle: "ਜਵਾਬ",
        questionLabel: "ਸਵਾਲ",
        responseLabel: "ਜਵਾਬ",
        responseEnLabel: "ਜਵਾਬ (ਅੰਗਰੇਜ਼ੀ)",
        audioQuestion: "ਆਡੀਓ ਸਵਾਲ",
        apiStatusSending: "ਬੇਨਤੀ ਭੇਜੀ ਜਾ ਰਹੀ ਹੈ...",
        apiStatusSuccess: "ਜਵਾਬ ਸਫਲਤਾਪੂਰਵਕ ਪ੍ਰਾਪਤ ਹੋਇਆ",
        apiStatusFailed: "ਬੇਨਤੀ ਅਸਫਲ",
        errorTimeout: "ਬੇਨਤੀ ਦਾ ਸਮਾਂ ਸਮਾਪਤ (30s) - ਕਿਰਪਾ ਕਰਕੇ ਛੋਟੀ ਰਿਕਾਰਡਿੰਗ ਅਜ਼ਮਾਓ",
        errorPrefix: "ਗਲਤੀ",
        footer: "© 2023 ਮਲਟੀਲਿੰਗੁਅਲ ਪ੍ਰਸ਼ਨ-ਉੱਤਰ ਪੋਰਟਲ। ਸਾਰੇ ਅਧਿਕਾਰ ਰਾਖਵੇਂ ਹਨ।"
    },
    mr: {
        title: "कृषीसेतू: बहुभाषी प्रश्नोत्तर पोर्टल",
        subtitle: "मजकूर किंवा आवाजाद्वारे तुमच्या पसंतीच्या भाषेत उत्तरे मिळवा",
        textTab: "मजकूर इनपुट",
        voiceTab: "व्हॉइस इनपुट",
        textPlaceholder: "तुमचा प्रश्न येथे टाइप करा...",
        submitText: "सबमिट करा",
        recordButton: "रेकॉर्डिंग सुरू करा",
        submitAudio: "रेकॉर्डिंग सबमिट करा",
        recordingStatus: "रेकॉर्ड करण्यासाठी तयार",
        responseTitle: "प्रतिसाद",
        questionLabel: "प्रश्न",
        responseLabel: "उत्तर",
        responseEnLabel: "उत्तर (इंग्रजी)",
        audioQuestion: "ऑडिओ प्रश्न",
        apiStatusSending: "विनंती पाठविली जात आहे...",
        apiStatusSuccess: "उत्तर यशस्वीरित्या मिळाले",
        apiStatusFailed: "विनंती अयशस्वी",
        errorTimeout: "विनंतीची मुदत संपली (30s) - कृपया लहान रेकॉर्डिंग वापरून पहा",
        errorPrefix: "त्रुटी",
        footer: "© 2023 बहुभाषी प्रश्नोत्तर पोर्टल. सर्व हक्क राखीव."
    },
    bn: {
        title: "কৃষিসেতু: বহুভাষিক প্রশ্নোত্তর পোর্টাল",
        subtitle: "টেক্সট বা ভয়েসের মাধ্যমে আপনার পছন্দের ভাষায় উত্তর পান",
        textTab: "টেক্সট ইনপুট",
        voiceTab: "ভয়েস ইনপুট",
        textPlaceholder: "আপনার প্রশ্ন এখানে টাইপ করুন...",
        submitText: "জমা দিন",
        recordButton: "রেকর্ডিং শুরু করুন",
        submitAudio: "রেকর্ডিং জমা দিন",
        recordingStatus: "রেকর্ড করার জন্য প্রস্তুত",
        responseTitle: "প্রতিক্রিয়া",
        questionLabel: "প্রশ্ন",
        responseLabel: "উত্তর",
        responseEnLabel: "উত্তর (ইংরেজি)",
        audioQuestion: "অডিও প্রশ্ন",
        apiStatusSending: "অনুরোধ পাঠানো হচ্ছে...",
        apiStatusSuccess: "সফলভাবে উত্তর পাওয়া গেছে",
        apiStatusFailed: "অনুরোধ ব্যর্থ হয়েছে",
        errorTimeout: "অনুরোধের সময় শেষ (30s) - দয়া করে ছোট রেকর্ডিং চেষ্টা করুন",
        errorPrefix: "ত্রুটি",
        footer: "© 2023 বহুভাষিক প্রশ্নোত্তর পোর্টাল। সর্বস্বত্ব সংরক্ষিত।"
    }
};

// DOM Elements for language selection
const translateBtn = document.getElementById('translateBtn');
const languageModal = document.getElementById('languageModal');
const languageGrid = document.getElementById('languageGrid');
const languageSearch = document.getElementById('languageSearch');
const closeBtn = document.querySelector('.close-btn');

// Current language (default to English)
let currentLanguage = 'en';

// Initialize the language grid
function initLanguageGrid() {
    languageGrid.innerHTML = '';
    
    languages.forEach(lang => {
        const languageCard = document.createElement('div');
        languageCard.className = 'language-card';
        languageCard.innerHTML = `
            <div class="language-icon">
                <i class="${lang.iconClass}"></i>
            </div>
            <div class="language-name">${lang.name}</div>
            <div class="language-name-native">${lang.nativeName}</div>
            <div class="language-support">
                ${lang.audioSupport ? '<span class="support-badge"><i class="fas fa-microphone"></i> Audio</span>' : ''}
                ${lang.textSupport ? '<span class="support-badge"><i class="fas fa-font"></i> Text</span>' : ''}
            </div>
        `;
        
        languageCard.addEventListener('click', () => {
            selectLanguage(lang.code);
        });
        
        languageGrid.appendChild(languageCard);
    });
}

// Search functionality for languages
languageSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.language-card');
    
    cards.forEach(card => {
        const name = card.querySelector('.language-name').textContent.toLowerCase();
        const nativeName = card.querySelector('.language-name-native').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || nativeName.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

// Select language function
function selectLanguage(langCode) {
    currentLanguage = langCode;
    updateSelectedLanguageUI();
    console.log(`Language changed to: ${langCode}`);
    
    // Update UI to reflect selected language
    updateSelectedLanguageUI();
    
    // Close the modal
    languageModal.style.display = 'none';
    
    // Change the translate button text to the selected language
    const selectedLang = languages.find(lang => lang.code === langCode);
    if (selectedLang) {
        translateBtn.querySelector('span').textContent = selectedLang.name;
    }
    
    // Update the language dropdown in the form (if exists)
    const languageDropdown = document.getElementById('language');
    if (languageDropdown) {
        languageDropdown.value = langCode;
    }
}

// Update UI after language selection
// function updateSelectedLanguageUI() {
//     // This would update all the text in your portal to the selected language
//     // Implementation depends on your i18n setup
//     console.log('Updating UI for language:', currentLanguage);
// }

function updateSelectedLanguageUI() {
    const translations = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    
    // Update all text elements
    document.querySelector('.header h1').textContent = translations.title;
    document.querySelector('.header p').textContent = translations.subtitle;
    document.querySelector('.tab-button:nth-child(1)').innerHTML = `<i class="fas fa-keyboard"></i> ${translations.textTab}`;
    document.querySelector('.tab-button:nth-child(2)').innerHTML = `<i class="fas fa-microphone"></i> ${translations.voiceTab}`;
    document.getElementById('textInput').placeholder = translations.textPlaceholder;
    document.querySelector('.submit-btn').innerHTML = `<i class="fas fa-paper-plane"></i> ${translations.submitText}`;
    document.getElementById('recordText').textContent = translations.recordButton;
    document.getElementById('submitAudio').innerHTML = `<i class="fas fa-paper-plane"></i> ${translations.submitAudio}`;
    document.getElementById('recordingStatus').textContent = translations.recordingStatus;
    document.querySelector('.response-section h3').innerHTML = `<i class="fas fa-reply"></i> ${translations.responseTitle}`;
    document.querySelector('.footer p').textContent = translations.footer;

    // Update translate button
    translateBtn.innerHTML = `<i class="fas fa-language"></i> <span>${translations.submitText || 'Submit'}</span>`;
}

// Event listeners for language selection
if (translateBtn) {
    translateBtn.addEventListener('click', () => {
        languageModal.style.display = 'flex';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        languageModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === languageModal) {
        languageModal.style.display = 'none';
    }
});

// Initialize the language functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    initLanguageGrid();
    updateSelectedLanguageUI();

    switchTab('audio');

    
    // Set initial language button text
    const englishLang = languages.find(lang => lang.code === 'en');
    if (englishLang && translateBtn) {
        translateBtn.querySelector('span').textContent = englishLang.name;
    }
});