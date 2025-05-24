// ESP32 AI Robot with WiFi and Audio Capabilities
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <driver/i2s.h>
#include <AudioTools.h> // For audio processing

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// AI API endpoint (replace with your preferred AI service)
const char* aiEndpoint = "https://api.example.com/v1/chat/completions";
const char* apiKey = "YOUR_API_KEY";

// Pin definitions
const int LED_PIN = 2;       // Built-in LED on most ESP32 dev boards
const int MIC_SD = 32;       // I2S microphone SD pin
const int MIC_WS = 25;       // I2S microphone WS pin
const int MIC_SCK = 33;      // I2S microphone SCK pin
const int SPEAKER_SD = 26;   // I2S speaker SD pin
const int SPEAKER_WS = 27;   // I2S speaker WS pin
const int SPEAKER_SCK = 14;  // I2S speaker SCK pin

// Audio configuration
const int sampleRate = 16000;
const int bufferSize = 1024;
int16_t audioBuffer[bufferSize];

// I2S configuration for microphone
i2s_config_t i2s_mic_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate = sampleRate,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 8,
    .dma_buf_len = bufferSize,
    .use_apll = false,
    .tx_desc_auto_clear = false,
    .fixed_mclk = 0
};

// I2S pins for microphone
i2s_pin_config_t i2s_mic_pins = {
    .bck_io_num = MIC_SCK,
    .ws_io_num = MIC_WS,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num = MIC_SD
};

// I2S configuration for speaker
i2s_config_t i2s_speaker_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
    .sample_rate = sampleRate,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 8,
    .dma_buf_len = bufferSize,
    .use_apll = false,
    .tx_desc_auto_clear = true,
    .fixed_mclk = 0
};

// I2S pins for speaker
i2s_pin_config_t i2s_speaker_pins = {
    .bck_io_num = SPEAKER_SCK,
    .ws_io_num = SPEAKER_WS,
    .data_out_num = SPEAKER_SD,
    .data_in_num = I2S_PIN_NO_CHANGE
};

// Audio processing objects
AudioProcessor audioProcessor;
SpeechDetector speechDetector;

void setup() {
  Serial.begin(115200);
  
  // Initialize LED
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH); // Turn on LED to indicate power
  
  // Connect to WiFi
  connectToWiFi();
  
  // Initialize I2S for microphone
  initI2SMicrophone();
  
  // Initialize I2S for speaker
  initI2SSpeaker();
  
  // Initialize audio processor
  initAudioProcessor();
  
  Serial.println("ESP32 AI Robot initialized and ready!");
}

void loop() {
  // Blink LED to indicate system is running
  blinkLED();
  
  // Check if speech is detected
  if (detectSpeech()) {
    // Record audio from microphone
    int16_t* audioData = recordAudio();
    
    // Process audio (noise reduction, etc.)
    audioProcessor.process(audioData, bufferSize);
    
    // Convert audio to text using AI service
    String userText = speechToText(audioData);
    
    if (userText.length() > 0) {
      Serial.println("User said: " + userText);
      
      // Get AI response
      String aiResponse = getAIResponse(userText);
      
      // Convert AI response to speech
      textToSpeech(aiResponse);
    }
  }
  
  delay(100); // Small delay to prevent CPU overload
}

void connectToWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.println("IP address: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nFailed to connect to WiFi. Please check credentials.");
  }
}

void initI2SMicrophone() {
  Serial.println("Initializing I2S microphone...");
  
  esp_err_t err = i2s_driver_install(I2S_NUM_0, &i2s_mic_config, 0, NULL);
  if (err != ESP_OK) {
    Serial.printf("Failed to install I2S driver for microphone: %d\n", err);
    return;
  }
  
  err = i2s_set_pin(I2S_NUM_0, &i2s_mic_pins);
  if (err != ESP_OK) {
    Serial.printf("Failed to set I2S pins for microphone: %d\n", err);
    return;
  }
  
  Serial.println("I2S microphone initialized successfully");
}

void initI2SSpeaker() {
  Serial.println("Initializing I2S speaker...");
  
  esp_err_t err = i2s_driver_install(I2S_NUM_1, &i2s_speaker_config, 0, NULL);
  if (err != ESP_OK) {
    Serial.printf("Failed to install I2S driver for speaker: %d\n", err);
    return;
  }
  
  err = i2s_set_pin(I2S_NUM_1, &i2s_speaker_pins);
  if (err != ESP_OK) {
    Serial.printf("Failed to set I2S pins for speaker: %d\n", err);
    return;
  }
  
  Serial.println("I2S speaker initialized successfully");
}

void initAudioProcessor() {
  // Initialize audio processing components
  audioProcessor.setNoiseReductionLevel(0.3);
  audioProcessor.setGain(1.5);
  
  // Initialize speech detector
  speechDetector.setThreshold(0.2);
  speechDetector.setMinDuration(500); // 500ms minimum speech duration
}

void blinkLED() {
  static unsigned long lastBlink = 0;
  static bool ledState = false;
  
  if (millis() - lastBlink > 1000) { // Blink every second
    ledState = !ledState;
    digitalWrite(LED_PIN, ledState);
    lastBlink = millis();
  }
}

bool detectSpeech() {
  // Read a small audio sample to detect speech
  size_t bytesRead = 0;
  i2s_read(I2S_NUM_0, audioBuffer, bufferSize * 2, &bytesRead, 0);
  
  if (bytesRead > 0) {
    return speechDetector.isSpeechDetected(audioBuffer, bytesRead / 2);
  }
  
  return false;
}

int16_t* recordAudio() {
  Serial.println("Recording audio...");
  
  // Turn LED solid to indicate recording
  digitalWrite(LED_PIN, HIGH);
  
  // Record audio for a few seconds
  size_t bytesRead = 0;
  i2s_read(I2S_NUM_0, audioBuffer, bufferSize * 2, &bytesRead, portMAX_DELAY);
  
  // Resume blinking LED
  digitalWrite(LED_PIN, LOW);
  
  return audioBuffer;
}

String speechToText(int16_t* audioData) {
  Serial.println("Converting speech to text...");
  
  // We need to encode the audio data to send to a speech-to-text service
  // For this example, we'll use a simple HTTP POST to a service like Whisper API
  
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected. Reconnecting...");
    connectToWiFi();
    if (WiFi.status() != WL_CONNECTED) {
      return "";
    }
  }
  
  // Prepare the audio data for transmission
  // This would typically involve encoding the audio in a format like base64
  // or sending it as a binary file in a multipart form
  
  HTTPClient http;
  http.begin("https://api.openai.com/v1/audio/transcriptions");
  http.addHeader("Authorization", "Bearer " + String(apiKey));
  
  // In a real implementation, you would:
  // 1. Convert the raw audio data to the required format (e.g., WAV)
  // 2. Create a multipart form with the audio file
  // 3. Send the request to the speech-to-text API
  
  // For demonstration, we'll simulate the API call
  Serial.println("Sending audio to speech-to-text service...");
  
  // Simulate network delay
  delay(1000);
  
  // In a real implementation, you would parse the JSON response
  // For now, we'll return a simulated result
  http.end();
  
  return "Hello, how can you help me?";
  
  // In a real implementation, you would:
  /*
  String response = http.getString();
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, response);
  return doc["text"].as<String>();
  */
}

String getAIResponse(String userText) {
  Serial.println("Getting AI response for: " + userText);
  
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected. Reconnecting...");
    connectToWiFi();
    if (WiFi.status() != WL_CONNECTED) {
      return "I'm sorry, I can't connect to the internet right now.";
    }
  }
  
  HTTPClient http;
  http.begin(aiEndpoint);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(apiKey));
  
  // Create JSON payload for AI API
  DynamicJsonDocument doc(1024);
  doc["model"] = "gpt-3.5-turbo";
  JsonArray messages = doc.createNestedArray("messages");
  
  JsonObject systemMessage = messages.createNestedObject();
  systemMessage["role"] = "system";
  systemMessage["content"] = "You are a helpful robot assistant. Keep responses brief and friendly.";
  
  JsonObject userMessage = messages.createNestedObject();
  userMessage["role"] = "user";
  userMessage["content"] = userText;
  
  String requestBody;
  serializeJson(doc, requestBody);
  
  int httpResponseCode = http.POST(requestBody);
  String response = "";
  
  if (httpResponseCode > 0) {
    response = http.getString();
    
    // Parse the JSON response
    DynamicJsonDocument responseDoc(2048);
    DeserializationError error = deserializeJson(responseDoc, response);
    
    if (!error) {
      // Extract the assistant's message
      String assistantResponse = responseDoc["choices"][0]["message"]["content"].as<String>();
      return assistantResponse;
    } else {
      return "Error parsing AI response.";
    }
  } else {
    return "Error connecting to AI service: " + String(httpResponseCode);
  }
}

void textToSpeech(String text) {
  Serial.println("Converting text to speech: " + text);
  
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected. Reconnecting...");
    connectToWiFi();
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("Failed to connect to WiFi. Cannot convert text to speech.");
      return;
    }
  }
  
  // In a real implementation, you would send the text to a TTS service
  // like Google Text-to-Speech, Amazon Polly, or OpenAI's TTS API
  
  HTTPClient http;
  http.begin("https://api.openai.com/v1/audio/speech");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(apiKey));
  
  // Create JSON payload for TTS API
  DynamicJsonDocument doc(1024);
  doc["model"] = "tts-1";
  doc["input"] = text;
  doc["voice"] = "alloy"; // Options include: alloy, echo, fable, onyx, nova, shimmer
  
  String requestBody;
  serializeJson(doc, requestBody);
  
  Serial.println("Sending text to TTS service...");
  
  // In a real implementation, you would:
  // 1. Send the request to the TTS API
  // 2. Receive the audio data
  // 3. Play it through the I2S speaker
  
  // Simulate network delay
  delay(1000);
  
  // Turn on LED to indicate speaking
  digitalWrite(LED_PIN, HIGH);
  
  // For demonstration, we'll simulate playing the audio
  Serial.println("Playing audio response through speaker...");
  
  // In a real implementation, you would:
  /*
  int httpResponseCode = http.POST(requestBody);
  if (httpResponseCode > 0) {
    // Get the audio data
    WiFiClient* stream = http.getStreamPtr();
    
    // Read the audio data in chunks and send to I2S speaker
    uint8_t buffer[1024];
    size_t bytesRead = 0;
    size_t bytesWritten = 0;
    
    while (http.connected() && (bytesRead = stream->readBytes(buffer, sizeof(buffer))) > 0) {
      i2s_write(I2S_NUM_1, buffer, bytesRead, &bytesWritten, portMAX_DELAY);
    }
  }
  */
  
  // Simulate speaking time (roughly 100ms per character)
  delay(text.length() * 100);
  
  http.end();
  
  // Resume blinking LED
  digitalWrite(LED_PIN, LOW);
}

void convertAudioFormat(int16_t* input, uint8_t* output, size_t length, const char* format) {
  // This function would convert raw audio data to the required format
  // For example, from raw PCM to WAV or MP3
  
  if (strcmp(format, "wav") == 0) {
    // Create WAV header
    // A basic WAV header is 44 bytes
    uint8_t wavHeader[44];
    
    // Fill in the WAV header (simplified example)
    // In a real implementation, you would properly format the WAV header
    // with sample rate, bit depth, etc.
    
    // Copy header to output
    memcpy(output, wavHeader, 44);
    
    // Copy audio data after header
    for (size_t i = 0; i < length; i++) {
      // Convert int16_t to bytes
      output[44 + i*2] = input[i] & 0xFF;
      output[44 + i*2 + 1] = (input[i] >> 8) & 0xFF;
    }
  }
  
  // Add other format conversions as needed
}

// Speech detector class implementation
class SpeechDetector {
private:
  float threshold;
  int minDuration;
  
public:
  SpeechDetector() : threshold(0.2), minDuration(500) {}
  
  void setThreshold(float value) {
    threshold = value;
  }
  
  void setMinDuration(int ms) {
    minDuration = ms;
  }
  
  bool isSpeechDetected(int16_t* buffer, size_t length) {
    // Calculate audio energy
    float energy = 0;
    for (size_t i = 0; i < length; i++) {
      energy += abs(buffer[i]) / 32768.0f;
    }
    energy /= length;
    
    // If energy is above threshold, consider it speech
    return energy > threshold;
  }
};

// Audio processor class implementation
class AudioProcessor {
private:
  float noiseReductionLevel;
  float gain;
  
public:
  AudioProcessor() : noiseReductionLevel(0.1), gain(1.0) {}
  
  void setNoiseReductionLevel(float level) {
    noiseReductionLevel = level;
  }
  
  void setGain(float value) {
    gain = value;
  }
  
  void process(int16_t* buffer, size_t length) {
    // Apply noise reduction (simple threshold-based)
    for (size_t i = 0; i < length; i++) {
      float sample = buffer[i] / 32768.0f;
      
      // Apply noise gate
      if (abs(sample) < noiseReductionLevel) {
        sample = 0;
      }
      
      // Apply gain
      sample *= gain;
      
      // Clip to prevent overflow
      if (sample > 1.0f) sample = 1.0f;
      if (sample < -1.0f) sample = -1.0f;
      
      // Convert back to int16_t
      buffer[i] = (int16_t)(sample * 32767);
    }
  }
};

console.log("This is a demonstration of the Arduino code for an ESP32-based AI robot.");
console.log("In a real implementation, you would upload this code to your ESP32 using the Arduino IDE.");
console.log("\nKey components of this solution:");
console.log("1. WiFi connectivity for API communication");
console.log("2. I2S audio interface for microphone and speaker");
console.log("3. Speech detection to trigger conversation");
console.log("4. Integration with an AI service for natural language processing");
console.log("5. LED indicator for system status");
console.log("\nTo implement this solution:");
console.log("1. Install required libraries: WiFi, HTTPClient, ArduinoJson, and audio libraries");
console.log("2. Configure your WiFi credentials and AI API endpoint");
console.log("3. Connect your hardware according to the pin definitions");
console.log("4. Upload the code to your ESP32");
