/**
 * audio-processor.js
 * AudioWorklet processor — captures raw mic PCM chunks and posts them
 * to the main thread for forwarding to the Gemini Live API.
 *
 * Must be served from the same origin as index.html.
 */
registerProcessor('audio-processor', class extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0]?.[0];
        if (input) {
            // Clone the Float32Array before posting (it's transferred otherwise)
            this.port.postMessage(new Float32Array(input));
        }
        return true; // keep processor alive
    }
});
