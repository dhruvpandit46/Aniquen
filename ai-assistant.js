// ==============================================
// AI ASSISTANT FOR ANIQUEN MUSIC PLAYER
// ==============================================

class AIVoiceAssistant {
    constructor() {
        this.isListening = false;
        this.isProcessing = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.wakeWords = ['aniquen', 'hello', 'hi', 'hey', 'hey aniquen', 'hello aniquen', 'hi aniquen', 'aniquen hello', 'aniquen hi', 'aniquen hey'];
        this.isWakeWordActive = false;
        this.lastCommand = '';
        this.commandHistory = [];
        
        // API Keys
        this.whisperApiKey = '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';
        this.llmApiKey = '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';
        
        // Model names
        this.whisperModel = 'whisper-large-v3-turbo';
        this.llmModel = 'openai/gpt-oss-120b';
        
        // Command definitions for the LLM
        this.commands = this.initializeCommands();
        
        // UI Elements
        this.aiButton = null;
        this.aiStatus = null;
        this.aiIndicator = null;
        this._savedVolume = 0.7;
        this.isWakeWordMode = false;
        this.songList = [];
        
        // Initialize
        this.initUI();
        // NOTE: Browser-native (Web Speech API) wake-word detection removed.
        // Wake-word detection is now handled entirely by our custom ONNX
        // model running on the remote server (see wakeword.js), which calls
        // this.onWakeWordDetected() directly when it detects "hey Aniquen".
        // this.initWakeWordDetection();
        
        console.log('🤖 AI Voice Assistant initialized');
    }

    initializeCommands() {
        return [
            // Playback Control
            { command: 'play', description: 'Resume playing the current song' },
            { command: 'pause', description: 'Pause the current song' },
            { command: 'stop', description: 'Stop the current song' },
            { command: 'next', description: 'Play the next song' },
            { command: 'previous', description: 'Play the previous song' },
            { command: 'shuffle', description: 'Toggle shuffle mode' },
            { command: 'repeat', description: 'Toggle repeat mode' },
            
            // Song Search & Play
            { command: 'play_song', description: 'Play a specific song by name' },
            { command: 'search', description: 'Search for a song' },
            
            // Volume Control
            { command: 'volume_up', description: 'Increase volume' },
            { command: 'volume_down', description: 'Decrease volume' },
            { command: 'set_volume', description: 'Set volume to specific level' },
            { command: 'mute', description: 'Mute the audio' },
            
            // Queue Management
            { command: 'add_to_queue', description: 'Add song to queue' },
            { command: 'play_next', description: 'Play song next' },
            { command: 'clear_queue', description: 'Clear the queue' },
            
            // Playlist Management
            { command: 'add_to_playlist', description: 'Add current song to playlist' },
            { command: 'create_playlist', description: 'Create a new playlist' },
            
            // Information
            { command: 'what_is_playing', description: 'Get current song info' },
            { command: 'help', description: 'List all available commands' }
        ];
    }

    initUI() {
        // Create AI button in header
        const headerContent = document.querySelector('.header-content');
        if (headerContent) {
            const aiButton = document.createElement('div');
            aiButton.className = 'ai-button';
            aiButton.innerHTML = `<i class="fas fa-microphone"></i>`;
            aiButton.title = 'Voice Assistant (Click to listen)';
            aiButton.id = 'ai-assistant-btn';
            
            // Add to header
            const navIcons = document.querySelector('.nav-icons');
            if (navIcons) {
                navIcons.appendChild(aiButton);
            }
            
            this.aiButton = aiButton;
            
            // Add click listener
            aiButton.addEventListener('click', () => this.toggleListening());
        }
        
        // Create AI Status Indicator
        const aiIndicator = document.createElement('div');
        aiIndicator.className = 'ai-indicator';
        aiIndicator.id = 'ai-indicator';
        aiIndicator.innerHTML = `
            <div class="ai-indicator-dot"></div>
            <span class="ai-indicator-text">AI Assistant</span>
            <div class="ai-indicator-status">Standby</div>
        `;
        document.body.appendChild(aiIndicator);
        this.aiIndicator = aiIndicator;
        
        // Add styles for AI components
        this.addAIstyles();
    }

    addAIstyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* AI Button Styles */
            .ai-button {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                position: relative;
                border: none;
            }
            
            .ai-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }
            
            .ai-button:active {
                transform: scale(0.95);
            }
            
            .ai-button i {
                color: white;
                font-size: 18px;
            }
            
            .ai-button.listening {
                animation: aiPulse 1.5s ease-in-out infinite;
                background: linear-gradient(135deg, #f5576c 0%, #ff6b6b 100%);
            }
            
            .ai-button.processing {
                animation: aiSpin 1s linear infinite;
            }
            
            .ai-button.wake-word-active {
                background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
                box-shadow: 0 0 40px rgba(0, 242, 254, 0.6);
            }
            
            @keyframes aiPulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                50% {
                    transform: scale(1.15);
                    box-shadow: 0 4px 30px rgba(102, 126, 234, 0.8);
                }
            }
            
            @keyframes aiSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* AI Indicator */
            .ai-indicator {
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(10, 10, 15, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 12px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 1000;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
                pointer-events: none;
            }
            
            .ai-indicator.visible {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
                pointer-events: auto;
            }
            
            .ai-indicator-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #4facfe;
                transition: background 0.3s;
                flex-shrink: 0;
            }
            
            .ai-indicator-dot.listening {
                animation: dotPulse 1s ease-in-out infinite;
                background: #f5576c;
            }
            
            .ai-indicator-dot.processing {
                animation: dotSpin 1s linear infinite;
                background: #ffd93d;
            }
            
            .ai-indicator-dot.wake {
                background: #00f2fe;
                animation: dotPulse 0.5s ease-in-out infinite;
            }
            
            .ai-indicator-dot.success {
                background: #00f2fe;
                animation: dotPulse 0.3s ease-in-out infinite;
            }
            
            @keyframes dotPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.5); opacity: 0.5; }
            }
            
            @keyframes dotSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .ai-indicator-text {
                font-size: 14px;
                font-weight: 600;
                color: white;
            }
            
            .ai-indicator-status {
                font-size: 12px;
                color: var(--text-muted);
                padding: 2px 10px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                white-space: nowrap;
            }
            
            .ai-indicator-status.listening {
                color: #f5576c;
            }
            
            .ai-indicator-status.processing {
                color: #ffd93d;
            }
            
            .ai-indicator-status.success {
                color: #00f2fe;
            }
            
            /* Voice Command Toast */
            .voice-command-toast {
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(10, 10, 15, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 12px 24px;
                z-index: 9999;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                font-size: 14px;
                color: white;
                text-align: center;
                max-width: 90%;
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }
            
            .voice-command-toast.visible {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            
            .voice-command-toast .command-text {
                font-weight: 600;
                color: #667eea;
            }
            
            .voice-command-toast .status-icon {
                margin-right: 8px;
            }
            
            /* Mobile responsiveness for AI indicator */
            @media (max-width: 480px) {
                .ai-indicator {
                    bottom: 70px;
                    padding: 10px 16px;
                    font-size: 12px;
                    max-width: 90%;
                }
                
                .ai-indicator-text {
                    font-size: 12px;
                }
                
                .ai-indicator-status {
                    font-size: 10px;
                }
                
                .voice-command-toast {
                    top: 70px;
                    font-size: 12px;
                    padding: 10px 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // WAKE WORD DETECTION
    // ==========================================
    // NOTE: The Web Speech API based wake-word listener that used to live
    // here (initWakeWordDetection / startWakeWordDetection /
    // wakeWordRecognition) has been removed. Wake-word detection is now
    // done by the custom ONNX model in wakeword.js, which calls
    // onWakeWordDetected() below directly over a WebSocket connection.
    // isWakeWordDetected() is kept as a small helper still used by
    // processVoiceInput() to avoid treating a lone wake word as a command.

    isWakeWordDetected(transcript) {
        return this.wakeWords.some(wakeWord => 
            transcript.includes(wakeWord.toLowerCase())
        );
    }

    onWakeWordDetected() {
        // Called by wakeword.js when the custom server-side model detects
        // "hey Aniquen". Unlike the old Web Speech flow (which just set a
        // mode flag and waited for a continuous transcript), we now
        // directly start real command recording via Whisper.
        if (this.isListening || this.isProcessing) return;

        this.updateUIState('wake');
        this.showToast('👋 I\'m listening! Give me a command.');

        // brief pause so the "I'm listening" toast is visible before the
        // mic recording UI takes over
        setTimeout(() => {
            this.startListening();
        }, 300);
    }

    // ==========================================
    // MAIN LISTENING FUNCTIONS
    // ==========================================
    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    async startListening() {
        if (this.isListening) return;
        
        try {
            // Pause the background wake-word listener while we record a
            // command — the socket stays open (no reconnect delay), we're
            // just not feeding it audio for a few seconds. This frees up
            // the server and avoids double-processing the same audio.
            if (typeof pauseWakeWordDetection === 'function') {
                pauseWakeWordDetection();
            }

            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });
            this._currentStream = stream;
            
            this.isListening = true;
            this.audioChunks = [];
            
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                this.processAudioRecording();
            };
            
            // Record in chunks - use shorter chunks for better response
            this.mediaRecorder.start(2000); // 2-second chunks
            
            this.updateUIState('listening');
            this.playBeep();
            this.showToast('🎤 Listening... Speak your command');
            
            // Hard safety cap — normally silence detection below will stop
            // things sooner (~7-8s total), this is just a worst-case limit.
            if (this.listeningTimeout) {
                clearTimeout(this.listeningTimeout);
            }
            this.listeningTimeout = setTimeout(() => {
                if (this.isListening) {
                    this.stopListening();
                }
            }, 9000);

            this._setupSilenceDetection(stream);
            
            console.log('🎤 Started listening');
            
        } catch (error) {
            console.error('Error starting listening:', error);
            this.showToast('❌ Could not access microphone. Please allow microphone access.');
            this.isListening = false;
            this.updateUIState('idle');
            if (typeof resumeWakeWordDetection === 'function') {
                resumeWakeWordDetection();
            }
        }
    }

    // Short beep so the user knows recording has actually started —
    // generated on the fly, no audio file needed.
    playBeep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = 880;
            gain.gain.value = 0.15;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
            osc.onended = () => ctx.close().catch(() => {});
        } catch (e) {
            console.warn('Beep failed:', e);
        }
    }

    // Watches mic volume (RMS) while recording a command. Ignores the first
    // ~3.5s (grace period, so it doesn't cut off before the user even starts
    // talking), then if volume stays below the silence threshold for 3
    // continuous seconds, auto-stops the recording.
    _setupSilenceDetection(stream) {
        const SILENCE_THRESHOLD = 0.02;
        const GRACE_PERIOD_MS = 3500;
        const SILENCE_DURATION_MS = 3000;
        const CHECK_INTERVAL_MS = 200;

        this._silenceCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = this._silenceCtx.createMediaStreamSource(stream);
        const analyser = this._silenceCtx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const dataArray = new Float32Array(analyser.fftSize);
        const startTime = Date.now();
        let silenceStart = null;

        this._silenceInterval = setInterval(() => {
            analyser.getFloatTimeDomainData(dataArray);
            let sumSq = 0;
            for (let i = 0; i < dataArray.length; i++) sumSq += dataArray[i] * dataArray[i];
            const rms = Math.sqrt(sumSq / dataArray.length);

            const elapsed = Date.now() - startTime;
            if (elapsed < GRACE_PERIOD_MS) return; // still in grace period, don't check yet

            if (rms < SILENCE_THRESHOLD) {
                if (silenceStart === null) silenceStart = Date.now();
                if (Date.now() - silenceStart >= SILENCE_DURATION_MS) {
                    console.log('🔇 Silence detected — auto-stopping recording');
                    this.stopListening();
                }
            } else {
                silenceStart = null; // reset the silence timer, they're still talking
            }
        }, CHECK_INTERVAL_MS);
    }

    _cleanupSilenceDetection() {
        if (this._silenceInterval) {
            clearInterval(this._silenceInterval);
            this._silenceInterval = null;
        }
        if (this._silenceCtx) {
            this._silenceCtx.close().catch(() => {});
            this._silenceCtx = null;
        }
    }

    stopListening() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        this._cleanupSilenceDetection();

        if (this._currentStream) {
            this._currentStream.getTracks().forEach(t => t.stop());
            this._currentStream = null;
        }
        
        this.isListening = false;
        this.updateUIState('idle');
        
        if (this.listeningTimeout) {
            clearTimeout(this.listeningTimeout);
        }

        // Resume the background wake-word listener now that we're done
        // recording — socket was never closed, so this is instant.
        if (typeof resumeWakeWordDetection === 'function') {
            resumeWakeWordDetection();
        }
        
        console.log('⏹️ Stopped listening');
    }

    async processAudioRecording() {
        if (this.audioChunks.length === 0) {
            this.updateUIState('idle');
            return;
        }
        
        this.isProcessing = true;
        this.updateUIState('processing');
        this.showToast('🧠 Processing your command...');
        
        try {
            // Combine chunks into one blob
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            
            // Convert to proper format for Whisper
            const audioData = await this.convertAudioForWhisper(audioBlob);
            
            if (!audioData) {
                this.showToast('❌ Could not process audio. Please try again.');
                this.isProcessing = false;
                this.updateUIState('idle');
                return;
            }
            
            // Step 1: Convert speech to text using Whisper
            const text = await this.speechToText(audioData);
            
            if (!text || text.trim().length === 0) {
                this.showToast('❌ I couldn\'t hear you. Please try again.');
                this.isProcessing = false;
                this.updateUIState('idle');
                return;
            }
            
            console.log('📝 Transcribed text:', text);
            
            // Step 2: Process command with LLM
            const command = await this.processWithLLM(text);
            
            // Step 3: Execute command
            await this.executeCommand(command);
            
        } catch (error) {
            console.error('Error processing audio:', error);
            this.showToast('❌ Error processing your command. Please try again.');
        } finally {
            this.isProcessing = false;
            this.audioChunks = [];
            this.updateUIState('idle');
        }
    }

    // ==========================================
    // AUDIO CONVERSION FOR WHISPER
    // ==========================================
    async convertAudioForWhisper(blob) {
        try {
            // Read the blob as ArrayBuffer
            const arrayBuffer = await blob.arrayBuffer();
            
            // Convert to base64
            const base64 = btoa(
                new Uint8Array(arrayBuffer).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            );
            
            return base64;
        } catch (error) {
            console.error('Audio conversion error:', error);
            return null;
        }
    }

    // ==========================================
    // SPEECH TO TEXT (Whisper) - FIXED
    // ==========================================
    async speechToText(base64Audio) {
        try {
            // Convert base64 to blob and send as form data
            const byteCharacters = atob(base64Audio);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'audio/webm' });
            
            // Create FormData for API request
            const formData = new FormData();
            formData.append('file', blob, 'audio.webm');
            formData.append('model', this.whisperModel);
            formData.append('response_format', 'text');
            formData.append('language', 'en');
            
            // Call Groq API with FormData
            const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.whisperApiKey}`
                },
                body: formData
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Whisper API error response:', errorText);
                throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
            }
            
            const text = await response.text();
            return text.trim();
            
        } catch (error) {
            console.error('Whisper transcription error:', error);
            // Fallback: try using Web Speech API if available
            return await this.fallbackSpeechToText();
        }
    }

    // Fallback using Web Speech API
    fallbackSpeechToText() {
        return new Promise((resolve) => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                resolve('');
                return;
            }
            
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            
            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                resolve(text);
            };
            
            recognition.onerror = () => {
                resolve('');
            };
            
            recognition.start();
            
            // Timeout after 5 seconds
            setTimeout(() => {
                recognition.stop();
                resolve('');
            }, 5000);
        });
    }

    // ==========================================
    // PROCESS VOICE INPUT (for wake word mode)
    // ==========================================
    processVoiceInput(text) {
        if (!text || text.trim().length === 0) return;
        
        // Check if it's a wake word only
        if (this.isWakeWordDetected(text) && text.split(' ').length <= 3) {
            return; // Just wake word, wait for command
        }
        
        // Process the command
        this.processWithLLM(text).then(command => {
            this.executeCommand(command);
        }).catch(error => {
            console.error('Error processing voice input:', error);
        });
    }

    // ==========================================
    // LLM PROCESSING (GPT-120B) - FIXED WITH PROPER SONG LIST
    // ==========================================
    async processWithLLM(userText) {
        try {
            // Get fresh song list
            this.songList = musicLibrary || [];
            const songTitles = this.songList.map(s => s.title).join(', ');
            
            const systemPrompt = this.buildSystemPrompt(songTitles);
            
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.llmApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.llmModel,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userText }
                    ],
                    temperature: 0.3,
                    max_tokens: 200
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('LLM API error response:', errorText);
                throw new Error(`LLM API error: ${response.status}`);
            }
            
            const data = await response.json();
            let result;
            
            try {
                // Try to parse JSON from response
                const content = data.choices[0].message.content;
                // Remove any markdown code blocks if present
                const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                result = JSON.parse(cleanContent);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                // Fallback: try to extract command from text
                result = this.fallbackCommandParsing(userText);
            }
            
            console.log('🧠 LLM Response:', result);
            return result;
            
        } catch (error) {
            console.error('LLM processing error:', error);
            // Fallback: try to parse command directly
            return this.fallbackCommandParsing(userText);
        }
    }

    buildSystemPrompt(songTitles) {
        return `You are a voice assistant for a music player called "Aniquen". 
Your job is to parse voice commands and return structured JSON responses.

IMPORTANT: You MUST respond with valid JSON only. No other text.

Available commands:
${this.commands.map(c => `- ${c.command}: ${c.description}`).join('\n')}

EXACT SONG TITLES in the library:
${songTitles}

RULES:
1. When user says "play [song name]", find the EXACT or closest match from the song titles above
2. If user says "search [query]", return the search query
3. If user asks about current song, return "what_is_playing"
4. For volume commands, include a "value" field (0-100 for set_volume)
5. ALWAYS respond with valid JSON in this format:
{
    "command": "command_name",
    "params": { 
        "songName": "exact song title from list", 
        "query": "search term", 
        "playlist": "playlist name", 
        "value": "number between 0-100" 
    },
    "confidence": 0.9,
    "isCommand": true,
    "message": "What you understood from the user"
}

EXAMPLES:
- User: "play believer" → {"command": "play_song", "params": {"songName": "BELIEVER"}, "confidence": 0.95, "isCommand": true}
- User: "pause the music" → {"command": "pause", "params": {}, "confidence": 0.98, "isCommand": true}
- User: "play saka saka" → {"command": "play_song", "params": {"songName": "SAKA SAKA SAKA"}, "confidence": 0.95, "isCommand": true}
- User: "what is playing" → {"command": "what_is_playing", "params": {}, "confidence": 0.95, "isCommand": true}
- User: "add to favorites" → {"command": "add_to_playlist", "params": {"playlist": "Favorites"}, "confidence": 0.9, "isCommand": true}

If the command is not clear or doesn't match any command, set isCommand to false.

ONLY respond with JSON, no other text.`;
    }

    fallbackCommandParsing(text) {
        const lower = text.toLowerCase().trim();
        
        console.log('🔄 Fallback parsing:', lower);
        
        // Get fresh song list
        this.songList = musicLibrary || [];
        
        // Check for play song command
        if (lower.includes('play')) {
            // Extract potential song name
            let songName = lower.replace(/play\s*/i, '').trim();
            
            // Try to find exact match
            let match = this.songList.find(s => 
                s.title.toLowerCase() === songName ||
                s.title.toLowerCase() === songName.replace(/^the\s+/, '')
            );
            
            // Try partial match
            if (!match) {
                match = this.songList.find(s => 
                    s.title.toLowerCase().includes(songName) ||
                    songName.includes(s.title.toLowerCase())
                );
            }
            
            // Try word by word match
            if (!match) {
                const words = songName.split(' ');
                for (const word of words) {
                    if (word.length > 2) {
                        const found = this.songList.find(s => 
                            s.title.toLowerCase().includes(word) ||
                            s.artist.toLowerCase().includes(word)
                        );
                        if (found) {
                            match = found;
                            break;
                        }
                    }
                }
            }
            
            if (match) {
                return { 
                    command: 'play_song', 
                    params: { songName: match.title }, 
                    confidence: 0.85, 
                    isCommand: true,
                    message: `Playing ${match.title}`
                };
            } else {
                return { 
                    command: 'search', 
                    params: { query: songName }, 
                    confidence: 0.7, 
                    isCommand: true,
                    message: `Searching for ${songName}`
                };
            }
        }
        
        // Check for pause
        if (lower.includes('pause') || lower.includes('stop')) {
            return { command: 'pause', params: {}, confidence: 0.9, isCommand: true, message: 'Pausing' };
        }
        
        // Check for next
        if (lower.includes('next') || lower.includes('skip')) {
            return { command: 'next', params: {}, confidence: 0.9, isCommand: true, message: 'Next song' };
        }
        
        // Check for previous
        if (lower.includes('previous') || lower.includes('back')) {
            return { command: 'previous', params: {}, confidence: 0.9, isCommand: true, message: 'Previous song' };
        }
        
        // Check for shuffle
        if (lower.includes('shuffle')) {
            return { command: 'shuffle', params: {}, confidence: 0.9, isCommand: true, message: 'Toggling shuffle' };
        }
        
        // Check for repeat
        if (lower.includes('repeat')) {
            return { command: 'repeat', params: {}, confidence: 0.9, isCommand: true, message: 'Toggling repeat' };
        }
        
        // Check for volume
        if (lower.includes('volume up') || lower.includes('louder') || lower.includes('increase volume')) {
            return { command: 'volume_up', params: {}, confidence: 0.9, isCommand: true, message: 'Volume up' };
        }
        if (lower.includes('volume down') || lower.includes('quieter') || lower.includes('decrease volume')) {
            return { command: 'volume_down', params: {}, confidence: 0.9, isCommand: true, message: 'Volume down' };
        }
        if (lower.includes('mute')) {
            return { command: 'mute', params: {}, confidence: 0.9, isCommand: true, message: 'Toggling mute' };
        }
        
        // Check for what's playing
        if (lower.includes('what') && (lower.includes('playing') || lower.includes('song') || lower.includes('music'))) {
            return { command: 'what_is_playing', params: {}, confidence: 0.9, isCommand: true, message: 'Checking current song' };
        }
        
        // Check for help
        if (lower.includes('help') || lower.includes('commands') || lower.includes('what can you do')) {
            return { command: 'help', params: {}, confidence: 0.95, isCommand: true, message: 'Showing help' };
        }
        
        // If all else fails
        return { 
            command: 'unknown', 
            params: {}, 
            confidence: 0.1, 
            isCommand: false, 
            message: 'Command not recognized' 
        };
    }

    // ==========================================
    // COMMAND EXECUTION
    // ==========================================
    async executeCommand(command) {
        if (!command || !command.isCommand) {
            this.showToast('❌ I didn\'t quite understand that. Please try again.');
            return;
        }
        
        const cmd = command.command;
        const params = command.params || {};
        
        console.log('⚡ Executing command:', cmd, params);
        
        try {
            switch (cmd) {
                case 'play':
                    this.executePlay();
                    break;
                    
                case 'pause':
                    this.executePause();
                    break;
                    
                case 'stop':
                    this.executePause();
                    break;
                    
                case 'next':
                    this.executeNext();
                    break;
                    
                case 'previous':
                    this.executePrevious();
                    break;
                    
                case 'shuffle':
                    this.executeShuffle();
                    break;
                    
                case 'repeat':
                    this.executeRepeat();
                    break;
                    
                case 'play_song':
                    await this.executePlaySong(params.songName);
                    break;
                    
                case 'search':
                    this.executeSearch(params.query);
                    break;
                    
                case 'volume_up':
                    this.executeVolumeUp();
                    break;
                    
                case 'volume_down':
                    this.executeVolumeDown();
                    break;
                    
                case 'set_volume':
                    this.executeSetVolume(params.value);
                    break;
                    
                case 'mute':
                    this.executeMute();
                    break;
                    
                case 'add_to_queue':
                    await this.executeAddToQueue(params.songName);
                    break;
                    
                case 'play_next':
                    await this.executePlayNext(params.songName);
                    break;
                    
                case 'clear_queue':
                    this.executeClearQueue();
                    break;
                    
                case 'add_to_playlist':
                    await this.executeAddToPlaylist(params.songName, params.playlist);
                    break;
                    
                case 'create_playlist':
                    await this.executeCreatePlaylist(params.playlist);
                    break;
                    
                case 'what_is_playing':
                    this.executeWhatIsPlaying();
                    break;
                    
                case 'help':
                    this.executeHelp();
                    break;
                    
                default:
                    this.showToast('❌ Command not recognized. Say "help" for available commands.');
            }
        } catch (error) {
            console.error('Error executing command:', error);
            this.showToast('❌ Error executing command. Please try again.');
        }
    }

    // ==========================================
    // EXECUTION FUNCTIONS
    // ==========================================
    
    executePlay() {
        if (state.currentSong) {
            // Resume playing
            audioPlayer.play();
            state.isPlaying = true;
            updatePlayButtons();
            const albumArt = document.getElementById('album-art');
            if (albumArt) albumArt.classList.add('playing');
            this.showToast('▶️ Resuming playback');
        } else if (musicLibrary.length > 0) {
            // Play first song
            playSong(musicLibrary[0].id);
            this.showToast(`▶️ Playing ${musicLibrary[0].title}`);
        } else {
            this.showToast('❌ No songs available');
        }
    }
    
    executePause() {
        if (state.currentSong && state.isPlaying) {
            audioPlayer.pause();
            state.isPlaying = false;
            updatePlayButtons();
            const albumArt = document.getElementById('album-art');
            if (albumArt) albumArt.classList.remove('playing');
            this.showToast('⏸️ Paused');
        } else {
            this.showToast('⏸️ Already paused or no song playing');
        }
    }
    
    executeNext() {
        if (state.currentSong) {
            playNextSong();
            const song = musicLibrary.find(s => s.id === state.currentSong);
            this.showToast(`⏭️ Playing ${song ? song.title : 'next song'}`);
        } else {
            this.showToast('❌ No song playing');
        }
    }
    
    executePrevious() {
        if (state.currentSong) {
            playPreviousSong();
            const song = musicLibrary.find(s => s.id === state.currentSong);
            this.showToast(`⏮️ Playing ${song ? song.title : 'previous song'}`);
        } else {
            this.showToast('❌ No song playing');
        }
    }
    
    executeShuffle() {
        toggleShuffle();
        this.showToast(`🔀 Shuffle ${state.isShuffle ? 'enabled' : 'disabled'}`);
    }
    
    executeRepeat() {
        toggleRepeat();
        this.showToast(`🔁 Repeat ${state.isRepeat ? 'enabled' : 'disabled'}`);
    }
    
    async executePlaySong(songName) {
        if (!songName) {
            this.showToast('❌ Please specify a song name');
            return;
        }
        
        // Get fresh song list
        this.songList = musicLibrary || [];
        
        // Find the closest matching song
        const song = this.findClosestSong(songName);
        
        if (song) {
            playSong(song.id);
            this.showToast(`▶️ Playing ${song.title}`);
        } else {
            // Search for similar songs
            const similar = this.songList.filter(s => 
                s.title.toLowerCase().includes(songName.toLowerCase()) ||
                s.artist.toLowerCase().includes(songName.toLowerCase())
            );
            
            if (similar.length > 0) {
                playSong(similar[0].id);
                this.showToast(`▶️ Playing ${similar[0].title}`);
            } else {
                this.showToast(`❌ Could not find "${songName}"`);
            }
        }
    }
    
    findClosestSong(query) {
        if (!query) return null;
        
        const lowerQuery = query.toLowerCase().trim();
        
        // Get fresh song list
        this.songList = musicLibrary || [];
        
        // Exact match (case insensitive)
        let match = this.songList.find(s => 
            s.title.toLowerCase() === lowerQuery ||
            s.title.toLowerCase() === lowerQuery.replace(/^the\s+/, '')
        );
        if (match) return match;
        
        // Partial match (song title contains query or vice versa)
        match = this.songList.find(s => 
            s.title.toLowerCase().includes(lowerQuery) ||
            lowerQuery.includes(s.title.toLowerCase())
        );
        if (match) return match;
        
        // Word by word match
        const words = lowerQuery.split(' ');
        for (const word of words) {
            if (word.length > 2) {
                match = this.songList.find(s => 
                    s.title.toLowerCase().includes(word) ||
                    s.artist.toLowerCase().includes(word)
                );
                if (match) return match;
            }
        }
        
        // Try removing common words and search again
        const cleanedQuery = lowerQuery.replace(/play|please|now|the|a|an/g, '').trim();
        if (cleanedQuery && cleanedQuery !== lowerQuery) {
            return this.findClosestSong(cleanedQuery);
        }
        
        return null;
    }
    
    executeSearch(query) {
        if (!query) {
            this.showToast('❌ Please specify what to search for');
            return;
        }
        
        // Trigger search in UI
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = query;
            searchInput.focus();
            // Trigger search
            const event = new Event('input');
            searchInput.dispatchEvent(event);
            this.showToast(`🔍 Searching for "${query}"`);
        }
    }
    
    executeVolumeUp() {
        let newVolume = Math.min(1, audioPlayer.volume + 0.1);
        audioPlayer.volume = newVolume;
        state.volume = newVolume;
        this.showToast(`🔊 Volume: ${Math.round(newVolume * 100)}%`);
    }
    
    executeVolumeDown() {
        let newVolume = Math.max(0, audioPlayer.volume - 0.1);
        audioPlayer.volume = newVolume;
        state.volume = newVolume;
        this.showToast(`🔉 Volume: ${Math.round(newVolume * 100)}%`);
    }
    
    executeSetVolume(value) {
        let newVolume = parseInt(value) / 100;
        if (isNaN(newVolume) || newVolume < 0 || newVolume > 1) {
            this.showToast('❌ Please specify a volume between 0 and 100');
            return;
        }
        audioPlayer.volume = newVolume;
        state.volume = newVolume;
        this.showToast(`🔊 Volume: ${Math.round(newVolume * 100)}%`);
    }
    
    executeMute() {
        if (audioPlayer.volume > 0) {
            this._savedVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            this.showToast('🔇 Muted');
        } else {
            audioPlayer.volume = this._savedVolume || 0.7;
            this.showToast('🔊 Unmuted');
        }
    }
    
    async executeAddToQueue(songName) {
        if (!songName) {
            this.showToast('❌ Please specify a song to add');
            return;
        }
        
        const song = this.findClosestSong(songName);
        if (song) {
            addToQueue(song.id);
            this.showToast(`➕ Added "${song.title}" to queue`);
        } else {
            this.showToast(`❌ Could not find "${songName}"`);
        }
    }
    
    async executePlayNext(songName) {
        if (!songName) {
            this.showToast('❌ Please specify a song');
            return;
        }
        
        const song = this.findClosestSong(songName);
        if (song) {
            playNext(song.id);
            this.showToast(`⏭️ "${song.title}" will play next`);
        } else {
            this.showToast(`❌ Could not find "${songName}"`);
        }
    }
    
    executeClearQueue() {
        clearQueue();
        this.showToast('🗑️ Queue cleared');
    }
    
    async executeAddToPlaylist(songName, playlistName) {
        const song = songName ? this.findClosestSong(songName) : musicLibrary.find(s => s.id === state.currentSong);
        
        if (!song) {
            this.showToast('❌ No song specified or playing');
            return;
        }
        
        // Find or create playlist
        let playlist = state.playlists.find(p => 
            p.name.toLowerCase() === (playlistName || 'favorites').toLowerCase()
        );
        
        if (!playlist) {
            playlist = {
                id: Date.now(),
                name: playlistName || 'Favorites',
                songs: [],
                color: getRandomColor()
            };
            state.playlists.push(playlist);
        }
        
        if (!playlist.songs.includes(song.id)) {
            playlist.songs.push(song.id);
            savePlaylists();
            updatePlaylists();
            this.showToast(`✅ Added "${song.title}" to "${playlist.name}"`);
        } else {
            this.showToast(`⚠️ "${song.title}" is already in "${playlist.name}"`);
        }
    }
    
    async executeCreatePlaylist(name) {
        if (!name) {
            this.showToast('❌ Please specify a playlist name');
            return;
        }
        
        // Check if playlist already exists
        if (state.playlists.some(p => p.name.toLowerCase() === name.toLowerCase())) {
            this.showToast(`⚠️ Playlist "${name}" already exists`);
            return;
        }
        
        const playlist = {
            id: Date.now(),
            name: name,
            songs: [],
            color: getRandomColor()
        };
        state.playlists.push(playlist);
        savePlaylists();
        updatePlaylists();
        this.showToast(`✅ Created playlist "${name}"`);
    }
    
    executeWhatIsPlaying() {
        if (state.currentSong) {
            const song = musicLibrary.find(s => s.id === state.currentSong);
            if (song) {
                const status = state.isPlaying ? '▶️ Playing' : '⏸️ Paused';
                this.showToast(`${status}: ${song.title} by ${song.artist} (${song.duration})`);
            }
        } else {
            this.showToast('❌ No song currently playing');
        }
    }
    
    executeHelp() {
        const commands = this.commands.map(c => 
            `• ${c.command}: ${c.description}`
        ).join('\n');
        
        this.showToast('📋 Available voice commands:');
        console.log('📋 Available voice commands:\n' + commands);
        
        // Display in a more visible way
        const helpToast = document.createElement('div');
        helpToast.className = 'voice-command-toast visible';
        helpToast.innerHTML = `
            <div style="max-height: 300px; overflow-y: auto; text-align: left;">
                <div style="font-weight: 700; margin-bottom: 8px;">📋 Available Commands:</div>
                <div style="font-size: 12px; line-height: 1.8;">
                    ${this.commands.map(c => 
                        `<div>• <strong>${c.command}</strong>: ${c.description}</div>`
                    ).join('')}
                </div>
                <div style="margin-top: 8px; font-size: 11px; color: var(--text-muted);">
                    Wake word: "hey Aniquen" (detected server-side)
                </div>
            </div>
        `;
        document.body.appendChild(helpToast);
        
        setTimeout(() => {
            helpToast.remove();
        }, 8000);
    }

    // ==========================================
    // UI UPDATE FUNCTIONS
    // ==========================================
    updateUIState(state) {
        if (!this.aiButton) return;
        
        // Remove all states
        this.aiButton.classList.remove('listening', 'processing', 'wake-word-active');
        
        switch (state) {
            case 'listening':
                this.aiButton.classList.add('listening');
                this.aiButton.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
                this.updateIndicator('listening', '🎤 Listening...');
                break;
                
            case 'processing':
                this.aiButton.classList.add('processing');
                this.aiButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
                this.updateIndicator('processing', '🧠 Processing...');
                break;
                
            case 'wake':
                this.aiButton.classList.add('wake-word-active');
                this.aiButton.innerHTML = `<i class="fas fa-microphone"></i>`;
                this.updateIndicator('wake', '👋 Wake word detected!');
                break;
                
            case 'idle':
            default:
                this.aiButton.innerHTML = `<i class="fas fa-microphone"></i>`;
                this.updateIndicator('idle', '🎵 Standby');
                break;
        }
    }
    
    updateIndicator(state, text) {
        if (!this.aiIndicator) return;
        
        const dot = this.aiIndicator.querySelector('.ai-indicator-dot');
        const status = this.aiIndicator.querySelector('.ai-indicator-status');
        
        if (dot) {
            dot.className = 'ai-indicator-dot';
            if (state !== 'idle') {
                dot.classList.add(state);
            }
        }
        
        if (status) {
            status.className = 'ai-indicator-status';
            if (state !== 'idle') {
                status.classList.add(state);
            }
            status.textContent = text || 'Standby';
        }
        
        // Show/hide indicator
        if (state !== 'idle') {
            this.aiIndicator.classList.add('visible');
        } else {
            setTimeout(() => {
                this.aiIndicator.classList.remove('visible');
            }, 1000);
        }
    }
    
    showToast(message) {
        // Remove existing toast
        const existing = document.querySelector('.voice-command-toast');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'voice-command-toast visible';
        toast.innerHTML = `<span class="status-icon">💬</span> ${message}`;
        document.body.appendChild(toast);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ==========================================
    // STARTUP
    // ==========================================
    start() {
        console.log('🤖 AI Voice Assistant is ready!');
        console.log('📋 Say "Hey Aniquen" (detected server-side) to wake me up!');
        console.log('📋 Or click the microphone button to start listening.');
        
        this.showToast('🎵 AI Assistant Ready! Say "Hey Aniquen" or click the mic to start.');
    }
}

// ==============================================
// INITIALIZE AI ASSISTANT
// ==============================================
let aiAssistant;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AI assistant after a small delay to ensure music player is ready
    setTimeout(() => {
        aiAssistant = new AIVoiceAssistant();
        aiAssistant.start();
        // FIXED: this used to run before aiAssistant was assigned (so
        // window.aiAssistant stayed undefined forever). Now it runs right
        // after assignment, so debugging via window.aiAssistant works.
        window.aiAssistant = aiAssistant;
    }, 1000);
});
