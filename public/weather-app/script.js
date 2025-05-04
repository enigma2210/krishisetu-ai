// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Translation dictionary
    const translations = {
        en: {
            app_title: "Weather Intelligence",
            detecting_location: "Detecting location...",
            current_weather: "Current Weather",
            "7day_forecast": "7-Day Forecast",
            refresh: "Refresh",
            select_state: "Select State",
            select_district: "Select District",
            use_my_location: "Use my location",
            loading_data: "Loading weather data...",
            data_provided_by: "Data provided by IMD (India Meteorological Department)",
            current_year: "2023",
            weather_intelligence: "Weather Intelligence Dashboard",
            wind: "Wind",
            humidity: "Humidity",
            precipitation: "Precipitation",
            pressure: "Pressure",
            observed_at: "Observed at",
            no_forecast_data: "No forecast data available",
            failed_location: "Failed to get your location",
            failed_weather: "Failed to fetch weather data",
            try_again: "Please try again",
            h: "H",
            l: "L",
            last_updated: "Last updated",
            default_weather: "Sunny"
            
        },
        hi: {
            app_title: "मौसम जानकारी",
            detecting_location: "स्थान का पता लगाया जा रहा है...",
            current_weather: "वर्तमान मौसम",
            "7day_forecast": "7-दिन का पूर्वानुमान",
            refresh: "ताज़ा करें",
            select_state: "राज्य चुनें",
            select_district: "जिला चुनें",
            use_my_location: "मेरा स्थान उपयोग करें",
            loading_data: "मौसम डेटा लोड हो रहा है...",
            data_provided_by: "डेटा आईएमडी (भारत मौसम विज्ञान विभाग) द्वारा प्रदान किया गया",
            current_year: "2023",
            weather_intelligence: "मौसम जानकारी डैशबोर्ड",
            wind: "हवा",
            humidity: "नमी",
            precipitation: "वर्षा",
            pressure: "दबाव",
            observed_at: "समय पर देखा गया",
            no_forecast_data: "कोई पूर्वानुमान डेटा उपलब्ध नहीं",
            failed_location: "आपका स्थान प्राप्त करने में विफल",
            failed_weather: "मौसम डेटा प्राप्त करने में विफल",
            try_again: "कृपया पुनः प्रयास करें",
            h: "अधिक",
            l: "कम",
            last_updated: "अंतिम अद्यतन",
            default_weather: "धूप"
        },
        mr: {
            app_title: "हवामान माहिती",
            detecting_location: "स्थान शोधत आहे...",
            current_weather: "सध्याचे हवामान",
            "7day_forecast": "7-दिवसीय अंदाज",
            refresh: "रिफ्रेश",
            select_state: "राज्य निवडा",
            select_district: "जिल्हा निवडा",
            use_my_location: "माझे स्थान वापरा",
            loading_data: "हवामान डेटा लोड होत आहे...",
            data_provided_by: "डेटा IMD (भारतीय हवामान विभाग) द्वारा प्रदान केला",
            current_year: "2023",
            weather_intelligence: "हवामान माहिती डॅशबोर्ड",
            wind: "वारा",
            humidity: "आर्द्रता",
            precipitation: "पाऊस",
            pressure: "दाब",
            observed_at: "वेळी निरीक्षण केले",
            no_forecast_data: "अंदाज डेटा उपलब्ध नाही",
            failed_location: "आपले स्थान मिळविण्यात अयशस्वी",
            failed_weather: "हवामान डेटा मिळविण्यात अयशस्वी",
            try_again: "कृपया पुन्हा प्रयत्न करा",
            h: "जा",
            l: "कमी",
            last_updated: "शेवटचे अद्यतन"
        },
        ta: { // Tamil
            app_title: "வானிலை தகவல்",
            detecting_location: "இடத்தை கண்டறிகிறது...",
            current_weather: "தற்போதைய வானிலை",
            "7day_forecast": "7-நாள் வானிலை முன்னறிவிப்பு",
            refresh: "புதுப்பி",
            select_state: "மாநிலத்தை தேர்ந்தெடு",
            select_district: "மாவட்டத்தை தேர்ந்தெடு",
            use_my_location: "என் இடத்தை பயன்படுத்து",
            loading_data: "வானிலை தரவு ஏற்றுகிறது...",
            data_provided_by: "IMD (இந்திய வானிலை ஆய்வுத்துறை) வழங்கிய தரவு",
            current_year: "2023",
            weather_intelligence: "வானிலை தகவல் டாஷ்போர்டு",
            wind: "காற்று",
            humidity: "ஈரப்பதம்",
            precipitation: "மழைப்பொழிவு",
            pressure: "அழுத்தம்",
            observed_at: "கவனிக்கப்பட்ட நேரம்",
            no_forecast_data: "முன்னறிவிப்பு தரவு இல்லை",
            failed_location: "உங்கள் இடத்தை பெற முடியவில்லை",
            failed_weather: "வானிலை தரவை பெற முடியவில்லை",
            try_again: "மீண்டும் முயற்சிக்கவும்",
            h: "அதி",
            l: "குறை",
            last_updated: "கடைசியாக புதுப்பிக்கப்பட்டது",
            default_weather: "வெயில்"
        },
        te: { // Telugu
            app_title: "వాతావరణ సమాచారం",
            detecting_location: "స్థానాన్ని గుర్తిస్తోంది...",
            current_weather: "ప్రస్తుత వాతావరణం",
            "7day_forecast": "7-రోజుల వాతావరణ అంచనా",
            refresh: "రిఫ్రెష్",
            select_state: "రాష్ట్రాన్ని ఎంచుకోండి",
            select_district: "జిల్లాను ఎంచుకోండి",
            use_my_location: "నా స్థానాన్ని ఉపయోగించు",
            loading_data: "వాతావరణ డేటా లోడ్ అవుతుంది...",
            data_provided_by: "IMD (భారత శాఖ వాతావరణ శాఖ) నుండి డేటా",
            current_year: "2023",
            weather_intelligence: "వాతావరణ సమాచార డాష్బోర్డ్",
            wind: "గాలి",
            humidity: "తేమ",
            precipitation: "వర్షపాతం",
            pressure: "పీడనం",
            observed_at: "గమనించిన సమయం",
            no_forecast_data: "అంచనా డేటా అందుబాటులో లేదు",
            failed_location: "మీ స్థానాన్ని పొందడంలో విఫలమైంది",
            failed_weather: "వాతావరణ డేటాను పొందడంలో విఫలమైంది",
            try_again: "దయచేసి మళ్లీ ప్రయత్నించండి",
            h: "ఎక్కువ",
            l: "తక్కువ",
            last_updated: "చివరిగా నవీకరించబడింది",
            default_weather: "ఎండ"
        },
        bn: { // Bengali
            app_title: "আবহাওয়া তথ্য",
            detecting_location: "অবস্থান সনাক্ত করা হচ্ছে...",
            current_weather: "বর্তমান আবহাওয়া",
            "7day_forecast": "৭-দিনের আবহাওয়ার পূর্বাভাস",
            refresh: "রিফ্রেশ",
            select_state: "রাজ্য নির্বাচন করুন",
            select_district: "জেলা নির্বাচন করুন",
            use_my_location: "আমার অবস্থান ব্যবহার করুন",
            loading_data: "আবহাওয়া ডেটা লোড হচ্ছে...",
            data_provided_by: "IMD (ভারতীয় আবহাওয়া বিভাগ) প্রদত্ত তথ্য",
            current_year: "২০২৩",
            weather_intelligence: "আবহাওয়া তথ্য ড্যাশবোর্ড",
            wind: "বাতাস",
            humidity: "আর্দ্রতা",
            precipitation: "বৃষ্টিপাত",
            pressure: "চাপ",
            observed_at: "পর্যবেক্ষণের সময়",
            no_forecast_data: "কোন পূর্বাভাস ডেটা নেই",
            failed_location: "আপনার অবস্থান পাওয়া যায়নি",
            failed_weather: "আবহাওয়া ডেটা পাওয়া যায়নি",
            try_again: "অনুগ্রহ করে আবার চেষ্টা করুন",
            h: "সর্বোচ্চ",
            l: "সর্বনিম্ন",
            last_updated: "সর্বশেষ আপডেট",
            default_weather: "রৌদ্রোজ্জ্বল"
        }
        // Add more languages as needed
    };

    // Current language
    let currentLanguage = 'en';

    // DOM Elements
    const languageSelect = document.getElementById('languageSelect');
    const forecastType = document.getElementById('forecastType');
    const refreshBtn = document.getElementById('refreshBtn');
    const cityDisplay = document.getElementById('city');
    const lastUpdatedDisplay = document.getElementById('lastUpdated');
    const weatherDataDiv = document.getElementById('weatherData');
    const stateSelect = document.getElementById('stateSelect');
    const districtSelect = document.getElementById('districtSelect');
    const useGPS = document.getElementById('useGPS');
    const stateDistrictSelector = document.getElementById('stateDistrictSelector');

    // State and District Data (sample - you would fetch this from an API)
    const statesAndDistricts = {
        "Delhi": ["Central Delhi", "New Delhi", "North Delhi"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
        "Karnataka": ["Bangalore", "Mysore", "Hubli"]
        // Add all Indian states and districts
    };

    // Initialize the app
    initApp();

    function initApp() {
        // Set up language change handler
        languageSelect.addEventListener('change', function() {
            currentLanguage = this.value;
            translatePage();
            // Refresh weather data to update language
            if (useGPS.checked) {
                loadWeatherByGPS();
            } else if (districtSelect.value) {
                loadWeatherByDistrict(stateSelect.value, districtSelect.value);
            }
        });

        // Populate states dropdown
        populateStates();
        
        // Set up event listeners
        setupEventListeners();
        
        // Load initial data based on GPS or default location
        loadInitialData();
    }

    function translatePage() {
        // Translate all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[currentLanguage] && translations[currentLanguage][key]) {
                element.textContent = translations[currentLanguage][key];
            }
        });

        // Special cases
        if (lastUpdatedDisplay.textContent.includes("Last updated")) {
            lastUpdatedDisplay.textContent = translations[currentLanguage].last_updated + ": " + 
                lastUpdatedDisplay.textContent.split(":")[1];
        }
    }

    function populateStates() {
        stateSelect.innerHTML = `<option value="" data-translate="select_state">Select State</option>`;
        Object.keys(statesAndDistricts).forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    }

    function populateDistricts(state) {
        districtSelect.innerHTML = `<option value="" data-translate="select_district">Select District</option>`;
        if (state && statesAndDistricts[state]) {
            districtSelect.disabled = false;
            statesAndDistricts[state].forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        } else {
            districtSelect.disabled = true;
        }
    }

    function setupEventListeners() {
        // State/District selection
        stateSelect.addEventListener('change', function() {
            populateDistricts(this.value);
        });

        // GPS toggle
        useGPS.addEventListener('change', function() {
            stateDistrictSelector.style.display = this.checked ? 'none' : 'flex';
            if (this.checked) {
                loadWeatherByGPS();
            }
        });

        // Refresh button
        refreshBtn.addEventListener('click', function() {
            if (useGPS.checked) {
                loadWeatherByGPS();
            } else if (districtSelect.value) {
                loadWeatherByDistrict(stateSelect.value, districtSelect.value);
            }
        });

        // Forecast type change
        forecastType.addEventListener('change', function() {
            if (useGPS.checked) {
                loadWeatherByGPS();
            } else if (districtSelect.value) {
                loadWeatherByDistrict(stateSelect.value, districtSelect.value);
            }
        });
    }

    function loadInitialData() {
        // Default to GPS if available
        if (navigator.geolocation) {
            useGPS.checked = true;
            stateDistrictSelector.style.display = 'none';
            loadWeatherByGPS();
        } else {
            // Default to Delhi if GPS not available
            stateSelect.value = 'Delhi';
            populateDistricts('Delhi');
            districtSelect.value = 'New Delhi';
            loadWeatherByDistrict('Delhi', 'New Delhi');
        }
    }

    async function loadWeatherByGPS() {
        showLoading();
        try {
            const position = await getCurrentPosition();
            const { latitude, longitude } = position.coords;
            cityDisplay.textContent = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`;
            await fetchWeatherData(latitude, longitude);
        } catch (error) {
            showError(translations[currentLanguage].failed_location, translations[currentLanguage].try_again);
            // Fallback to Delhi
            loadWeatherByDistrict('Delhi', 'New Delhi');
        }
    }

    async function loadWeatherByDistrict(state, district) {
        showLoading();
        // In a real app, you would have coordinates for each district
        // For demo, we'll use some approximate coordinates
        const districtCoordinates = {
            "New Delhi": { lat: 28.6139, lon: 77.2090 },
            "Mumbai": { lat: 19.0760, lon: 72.8777 },
            "Bangalore": { lat: 12.9716, lon: 77.5946 }
            // Add coordinates for all districts
        };
        
        if (districtCoordinates[district]) {
            cityDisplay.textContent = `${district}, ${state}`;
            await fetchWeatherData(districtCoordinates[district].lat, districtCoordinates[district].lon);
        } else {
            showError(translations[currentLanguage].no_forecast_data);
        }
    }

    function getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    async function fetchWeatherData(lat, lon) {
        try {
            const type = forecastType.value;
            let data;
            
            if (type === 'current') {
                data = await fetchCurrentWeather(lat, lon);
                displayCurrentWeather(data);
            } else {
                data = await fetchForecast(lat, lon);
                displayForecast(data);
            }
            
            lastUpdatedDisplay.textContent = `${translations[currentLanguage].last_updated}: ${new Date().toLocaleTimeString()}`;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            showError(translations[currentLanguage].failed_weather, translations[currentLanguage].try_again);
        }
    }

    async function fetchCurrentWeather(lat, lon) {
        // Use CORS proxy for IMD API
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const imdUrl = `https://mausam.imd.gov.in/api/current_wx_api.php?lat=${lat}&lon=${lon}`;
        
        try {
            const response = await fetch(proxyUrl + imdUrl);
            if (!response.ok) throw new Error('IMD API failed');
            return await response.json();
        } catch (error) {
            console.warn('IMD API failed, trying Open-Meteo');
            // Fallback to Open-Meteo
            const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m`;
            const response = await fetch(meteoUrl);
            const data = await response.json();
            
            // Transform Open-Meteo data to match our display format
            return {
                temp: data.current_weather.temperature,
                humidity: data.hourly.relativehumidity_2m[0],
                wind_speed: data.current_weather.windspeed,
                weather_code: data.current_weather.weathercode,
                station: translations[currentLanguage].current_location || "Current Location",
                time: new Date(data.current_weather.time).toLocaleTimeString()
            };
        }
    }

    async function fetchForecast(lat, lon) {
        // Use CORS proxy for IMD API
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const imdUrl = `https://city.imd.gov.in/api/cityweather_loc.php?lat=${lat}&lon=${lon}`;
        
        try {
            const response = await fetch(proxyUrl + imdUrl);
            if (!response.ok) throw new Error('IMD API failed');
            return await response.json();
        } catch (error) {
            console.warn('IMD API failed, trying Open-Meteo');
            // Fallback to Open-Meteo
            const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
            const response = await fetch(meteoUrl);
            const data = await response.json();
            
            // Transform Open-Meteo data to match our display format
            return {
                forecast: data.daily.time.map((date, i) => ({
                    date: date,
                    today_max_temp: data.daily.temperature_2m_max[i],
                    today_min_temp: data.daily.temperature_2m_min[i],
                    past_24_hrs_rainfall: data.daily.precipitation_sum[i],
                    todays_forecast: getWeatherDescription(data.daily.weathercode[i])
                }))
            };
        }
    }

    function displayCurrentWeather(data) {
        const weatherDescription = getWeatherDescription(data.weather_code);
        
        const html = `
            <div class="current-weather">
                <div class="weather-overview">
                    <div class="temperature-display">
                        ${data.temp}<span class="temperature-unit">°C</span>
                    </div>
                    <div class="weather-condition">
                        <div class="weather-icon">
                            ${getWeatherIcon(data.weather_code)}
                        </div>
                        <div>
                            <h2>${weatherDescription}</h2>
                            <p class="location">${data.station}</p>
                            <p class="observation-time">${translations[currentLanguage].observed_at}: ${data.time}</p>
                        </div>
                    </div>
                </div>
                
                <div class="weather-stats">
                    <div class="weather-card">
                        <h3><i class="fas fa-wind"></i> ${translations[currentLanguage].wind}</h3>
                        <p>${data.wind_speed || 'N/A'} km/h</p>
                    </div>
                    <div class="weather-card">
                        <h3><i class="fas fa-tint"></i> ${translations[currentLanguage].humidity}</h3>
                        <p>${data.humidity || 'N/A'}%</p>
                    </div>
                    <div class="weather-card">
                        <h3><i class="fas fa-cloud-rain"></i> ${translations[currentLanguage].precipitation}</h3>
                        <p>${data.rainfall || '0'} mm</p>
                    </div>
                    <div class="weather-card">
                        <h3><i class="fas fa-compass"></i> ${translations[currentLanguage].pressure}</h3>
                        <p>${data.mslp || 'N/A'} hPa</p>
                    </div>
                </div>
            </div>
        `;
        
        weatherDataDiv.innerHTML = html;
    }

    function displayForecast(data) {
        let html = `<div class="forecast-container">
            <h2>${translations[currentLanguage]['7day_forecast']}</h2>`;
    
        data.forecast.forEach(day => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString(currentLanguage, { weekday: 'short' });
            const dateStr = date.toLocaleDateString(currentLanguage);
            
            // Clean the weather description
            const weatherIcon = getWeatherIcon(day.weather_code);
            const weatherDesc = cleanWeatherString(day.todays_forecast || 'Sunny');
    
            html += `
            <div class="forecast-day">
                <div class="forecast-date">
                    <strong>${dayName}</strong> ${dateStr}
                </div>
                <div class="forecast-temps">
                    <span class="forecast-high">${translations[currentLanguage]['high_temp'] || 'H'}: ${day.today_max_temp}°</span>
                    <span class="forecast-low">${translations[currentLanguage]['low_temp'] || 'L'}: ${day.today_min_temp}°</span>
                </div>
                <div class="forecast-condition">
                    ${weatherIcon} ${weatherDesc}
                </div>
                <div class="forecast-rain">
                    <i class="fas fa-cloud-rain"></i> ${day.past_24_hrs_rainfall || '0'} mm
                </div>
            </div>`;
        });
    
        html += '</div>';
        weatherDataDiv.innerHTML = html;
    }

    function getWeatherIcon(code) {
        // Map weather codes to Font Awesome icons
        const iconMap = {
            1: '<i class="fas fa-sun"></i>',        // Clear
            2: '<i class="fas fa-cloud-sun"></i>',   // Partly cloudy
            3: '<i class="fas fa-cloud"></i>',       // Cloudy
            4: '<i class="fas fa-cloud-rain"></i>',  // Rain
            5: '<i class="fas fa-bolt"></i>',        // Thunderstorm
            6: '<i class="fas fa-snowflake"></i>',   // Snow
            7: '<i class="fas fa-smog"></i>',        // Fog
            default: '<i class="fas fa-question-circle" style="display:none"></i>'
        };
        return iconMap[code] || '<i class="fas fa-question"></i>';
    }

    function getWeatherDescription(code) {
        const descriptions = {
            en: {
                1: 'Clear sky',
                2: 'Partly cloudy',
                3: 'Cloudy',
                4: 'Rain',
                5: 'Thunderstorm',
                6: 'Snow',
                7: 'Fog'
            },
            hi: {
                1: 'साफ आसमान',
                2: 'आंशिक रूप से बादल',
                3: 'बादल',
                4: 'बारिश',
                5: 'तूफान',
                6: 'बर्फ',
                7: 'कोहरा'
            },
            mr: {
                1: 'स्वच्छ आकाश',
                2: 'अंशतः ढगाळ',
                3: 'ढगाळ',
                4: 'पाऊस',
                5: 'वादळ',
                6: 'बर्फ',
                7: 'धुके'
            },
            ta: {
                1: 'தெளிவான வானம்',
                2: 'ஓரளவு மேகமூட்டம்',
                3: 'மேகமூட்டம்',
                4: 'மழை',
                5: 'இடி மின்னல்',
                6: 'பனி',
                7: 'மூடுபனி'
            },
            te: {
                1: 'స్పష్టమైన ఆకాశం',
                2: 'పాక్షికంగా మేఘావృతం',
                3: 'మేఘావృతం',
                4: 'వర్షం',
                5: 'పెద్దగాలి',
                6: 'మంచు',
                7: 'పొగమంచు'
            },
            bn: {
                1: 'পরিষ্কার আকাশ',
                2: 'আংশিক মেঘলা',
                3: 'মেঘলা',
                4: 'বৃষ্টি',
                5: 'বজ্রঝড়',
                6: 'তুষার',
                7: 'কুয়াশা'
            }
        };
    
        const defaultTranslations = {
            en: 'Sunny',
            hi: 'धूप',
            ta: 'வெயில்',
            te: 'ఎండ',
            bn: 'রৌদ্রোজ্জ্বল',
            mr: 'सूर्यप्रकाश'
        };
    
        // 1. Get raw description
        let description = descriptions[currentLanguage]?.[code] || 
                         descriptions['en']?.[code] || 
                         defaultTranslations[currentLanguage] || 
                         'Sunny';
    
        // 2. Deep clean the string
        description = description = cleanWeatherString(description);
    
        // 3. Final fallback if cleaning resulted in empty string
        return description;
    }
    function cleanWeatherString(str) {
        return str
            .replace(/^[?]+/, '')  // Remove leading ?
            .replace(/[?]+$/, '')  // Remove trailing ?
            .replace(/\s{2,}/g, ' ') // Replace multiple spaces with one
            .trim();
    }

    function showLoading() {
        weatherDataDiv.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${translations[currentLanguage].loading_data}</p>
            </div>
        `;
    }

    function showError(message, secondaryMessage = '') {
        weatherDataDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                ${secondaryMessage ? `<p class="secondary">${secondaryMessage}</p>` : ''}
            </div>
        `;
    }
});