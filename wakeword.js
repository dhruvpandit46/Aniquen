// wakeword.js – background wake-word listener for the Aniquen music app.
// Streams mic audio to the remote (custom ONNX model) detection server.
// On detection, hands off to the AI assistant's startListening() so it
// actually records the follow-up command and runs it through Whisper + LLM.

(function () {
    const SAMPLE_RATE = 16000;
    const SERVER_URL = 'wss://34-55-6-30.sslip.io/ws'; // <-- your Google Cloud server

    let audioContext = null;
    let socket = null;
    let isWakeActive = false;
    let deviceSampleRate = SAMPLE_RATE;

    function resampleTo16k(input, inputRate) {
        if (inputRate === SAMPLE_RATE) return input;
        const ratio = inputRate / SAMPLE_RATE;
        const newLength = Math.round(input.length / ratio);
        const result = new Float32Array(newLength);
        for (let i = 0; i < newLength; i++) {
            const srcIndex = i * ratio;
            const idx0 = Math.floor(srcIndex);
            const idx1 = Math.min(idx0 + 1, input.length - 1);
            const frac = srcIndex - idx0;
            result[i] = input[idx0] * (1 - frac) + input[idx1] * frac;
        }
        return result;
    }

    // ----- visual feedback on detection, without touching style.css -----
    function flashHeader() {
        const header = document.querySelector('header');
        if (!header) return;
        const original = header.style.backgroundColor;
        const originalTransition = header.style.transition;
        header.style.transition = 'background-color 0.3s ease';
        header.style.backgroundColor = '#1f8b4c';
        setTimeout(() => {
            header.style.backgroundColor = original;
            header.style.transition = originalTransition;
        }, 1500);
    }

    function onWakeWordDetected() {
        if (isWakeActive) return;
        isWakeActive = true;
        flashHeader();

        // Hand off to the AI assistant — this starts actual mic recording,
        // Whisper transcription, and LLM command execution. `aiAssistant` is
        // a top-level `let` in ai-assistant.js, visible here as a shared
        // global binding since both scripts run in the same page scope.
        if (typeof aiAssistant !== 'undefined' && aiAssistant && typeof aiAssistant.onWakeWordDetected === 'function') {
            aiAssistant.onWakeWordDetected();
        } else if (typeof showToast === 'function') {
            // fallback in case the assistant hasn't finished initializing yet
            showToast('🎤 Wake word detected!');
        }

        // lock our own re-triggering briefly — the assistant's own
        // isListening/isProcessing flags handle the rest of the busy window
        setTimeout(() => { isWakeActive = false; }, 2500);
    }

    function connectSocket() {
        socket = new WebSocket(SERVER_URL);
        socket.binaryType = 'arraybuffer';

        socket.onopen = () => {
            console.log('[ANIQUEN wakeword] Connected to detection server.');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.idle) return;
            console.log('[ANIQUEN wakeword] prob:', data.prob, ' rolling max:', data.rolling_max);
            if (data.detected) {
                onWakeWordDetected();
            }
        };

        socket.onclose = () => {
            console.warn('[ANIQUEN wakeword] Connection closed — retrying in 2s...');
            setTimeout(connectSocket, 2000);
        };

        socket.onerror = (err) => {
            console.error('[ANIQUEN wakeword] Socket error:', err);
        };
    }

    function setupAudioProcessing(stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: SAMPLE_RATE,
        });
        deviceSampleRate = audioContext.sampleRate;
        console.log('[ANIQUEN wakeword] AudioContext rate:', deviceSampleRate);

        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (event) => {
            const inputData = event.inputBuffer.getChannelData(0);
            const scaled = new Float32Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
                scaled[i] = inputData[i] * 32768;
            }
            const resampled = resampleTo16k(scaled, deviceSampleRate);

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(resampled.buffer);
            }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
    }

    async function initWakeWordListener() {
        try {
            connectSocket();
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: SAMPLE_RATE,
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: true,
                }
            });
            setupAudioProcessing(stream);
            console.log('[ANIQUEN wakeword] Microphone ready, listening in background.');
            if (audioContext && audioContext.state === 'suspended') {
                await audioContext.resume();
            }
        } catch (err) {
            console.error('[ANIQUEN wakeword] Init error:', err);
        }
    }

    window.addEventListener('DOMContentLoaded', initWakeWordListener);

    window.addEventListener('beforeunload', () => {
        if (audioContext) audioContext.close().catch(() => {});
        if (socket) socket.close();
    });
})();
