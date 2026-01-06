#include <WiFi.h>
#include <WebServer.h>
#include <esp32-camera.h>
#include <HTTPClient.h>
#include <EEPROM.h>
#include <ArduinoJson.h>

// Camera module pins (For AI-THINKER ESP32-CAM)
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend server
const char* backendUrl = "http://YOUR_BACKEND_IP:3000";
const char* userId = "YOUR_USER_ID"; // Get this from your account setup

// Web server for configuration
WebServer server(80);

// Storage for WiFi credentials in EEPROM
#define EEPROM_SIZE 512
#define EEPROM_SSID_ADDR 0
#define EEPROM_PASS_ADDR 64
#define EEPROM_URL_ADDR 128
#define EEPROM_UID_ADDR 192

// Function prototypes
void setupCamera();
void initWiFi();
void captureAndUpload();
void handleConfigPage();
void handleSaveConfig();
void handleCapture();
String encodeBase64(uint8_t* data, size_t len);

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("\n\nInfinium ESP32-CAM Starting...");
    
    // Initialize EEPROM
    EEPROM.begin(EEPROM_SIZE);
    
    // Setup camera
    setupCamera();
    
    // Initialize WiFi
    initWiFi();
    
    // Setup web server for configuration
    server.on("/", handleConfigPage);
    server.on("/save-config", HTTP_POST, handleSaveConfig);
    server.on("/capture", HTTP_POST, handleCapture);
    server.begin();
    
    Serial.println("Setup complete!");
    Serial.print("Camera stream available at: http://");
    Serial.print(WiFi.localIP());
    Serial.println("/stream");
}

void loop() {
    server.handleClient();
    delay(10);
}

/**
 * Setup camera module
 */
void setupCamera() {
    camera_config_t config;
    config.ledc_channel = LEDC_CHANNEL_0;
    config.ledc_timer = LEDC_TIMER_0;
    config.pin_d7 = Y7_GPIO_NUM;
    config.pin_d6 = Y6_GPIO_NUM;
    config.pin_d5 = Y5_GPIO_NUM;
    config.pin_d4 = Y4_GPIO_NUM;
    config.pin_d3 = Y3_GPIO_NUM;
    config.pin_d2 = Y2_GPIO_NUM;
    config.pin_d1 = Y9_GPIO_NUM;
    config.pin_d0 = Y8_GPIO_NUM;
    config.pin_vsync = VSYNC_GPIO_NUM;
    config.pin_href = HREF_GPIO_NUM;
    config.pin_pclk = PCLK_GPIO_NUM;
    config.pin_pwdn = PWDN_GPIO_NUM;
    config.pin_reset = RESET_GPIO_NUM;
    config.pin_xclk = XCLK_GPIO_NUM;
    config.pin_sccb_sda = SIOD_GPIO_NUM;
    config.pin_sccb_scl = SIOC_GPIO_NUM;
    config.xclk_freq_hz = 20000000;
    config.pixel_format = PIXFORMAT_JPEG;
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 10;
    config.fb_count = 1;

    esp_err_t err = esp_camera_init(&config);
    if (err != ESP_OK) {
        Serial.printf("Camera init failed with error 0x%x", err);
        return;
    }
    
    Serial.println("Camera initialized successfully");
}

/**
 * Initialize WiFi connection
 */
void initWiFi() {
    // Read WiFi credentials from EEPROM
    char ssid_eeprom[64] = {0};
    char pass_eeprom[64] = {0};
    
    EEPROM.readString(EEPROM_SSID_ADDR, ssid_eeprom, 64);
    EEPROM.readString(EEPROM_PASS_ADDR, pass_eeprom, 64);
    
    // Use EEPROM values if available, otherwise use defaults
    const char* ssid_to_use = (strlen(ssid_eeprom) > 0) ? ssid_eeprom : ssid;
    const char* pass_to_use = (strlen(pass_eeprom) > 0) ? pass_eeprom : password;
    
    Serial.print("Connecting to WiFi: ");
    Serial.println(ssid_to_use);
    
    WiFi.begin(ssid_to_use, pass_to_use);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi connected!");
        Serial.print("IP address: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("\nFailed to connect to WiFi");
        Serial.println("Starting AP mode for configuration...");
        WiFi.softAP("Infinium-CAM", "12345678");
        Serial.print("AP IP address: ");
        Serial.println(WiFi.softAPIP());
    }
}

/**
 * Capture image and upload to backend
 */
void captureAndUpload() {
    Serial.println("Capturing image...");
    
    camera_fb_t * fb = esp_camera_fb_get();
    if (!fb) {
        Serial.println("Camera capture failed");
        return;
    }
    
    Serial.printf("Image size: %d bytes\n", fb->len);
    
    // Check WiFi connection
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi not connected. Reconnecting...");
        WiFi.reconnect();
        delay(2000);
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        // Create HTTP client
        HTTPClient http;
        String url = String(backendUrl) + "/api/esp32/upload";
        
        Serial.print("Uploading to: ");
        Serial.println(url);
        
        http.begin(url);
        http.addHeader("Content-Type", "application/json");
        
        // Encode image to base64
        String base64Image = base64::encode(fb->buf, fb->len);
        
        // Create JSON payload
        DynamicJsonDocument doc(1024);
        doc["userId"] = userId;
        doc["imageBuffer"] = base64Image;
        
        String jsonPayload;
        serializeJson(doc, jsonPayload);
        
        // Send request
        int httpResponseCode = http.POST(jsonPayload);
        
        Serial.print("Response code: ");
        Serial.println(httpResponseCode);
        
        if (httpResponseCode == 200) {
            String response = http.getString();
            Serial.println("Upload successful!");
            Serial.println(response);
        } else {
            Serial.println("Upload failed!");
            Serial.println(http.getString());
        }
        
        http.end();
    } else {
        Serial.println("Cannot upload - WiFi not connected");
    }
    
    esp_camera_fb_return(fb);
    Serial.println("Image capture and upload complete");
}

/**
 * Handle configuration web page
 */
void handleConfigPage() {
    String html = R"(
    <!DOCTYPE html>
    <html>
    <head>
        <title>Infinium ESP32-CAM Configuration</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: Arial; margin: 20px; background: #f0f0f0; }
            .container { max-width: 500px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
            h1 { color: #333; }
            input, button { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
            button { background: #4CAF50; color: white; cursor: pointer; }
            button:hover { background: #45a049; }
            .info { background: #e3f2fd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Infinium ESP32-CAM</h1>
            <div class="info">
                <p><strong>WiFi IP:</strong> )" + WiFi.localIP().toString() + R"(</p>
                <p><strong>WiFi Status:</strong> )" + (WiFi.status() == WL_CONNECTED ? "Connected" : "Not Connected") + R"(</p>
            </div>
            
            <form action="/save-config" method="POST">
                <label>WiFi SSID:</label>
                <input type="text" name="ssid" placeholder="Enter WiFi SSID" required>
                
                <label>WiFi Password:</label>
                <input type="password" name="password" placeholder="Enter WiFi password" required>
                
                <label>Backend URL:</label>
                <input type="text" name="url" placeholder="http://192.168.x.x:3000" required>
                
                <label>User ID:</label>
                <input type="text" name="uid" placeholder="Your User ID" required>
                
                <button type="submit">Save Configuration</button>
            </form>
            
            <button onclick="fetch('/capture', {method: 'POST'}).then(r => r.json()).then(d => alert('Capture: ' + d.message))">Capture & Upload Image</button>
        </div>
    </body>
    </html>
    )";
    
    server.send(200, "text/html", html);
}

/**
 * Handle saving configuration
 */
void handleSaveConfig() {
    if (server.hasArg("ssid") && server.hasArg("password") && 
        server.hasArg("url") && server.hasArg("uid")) {
        
        String ssid_val = server.arg("ssid");
        String pass_val = server.arg("password");
        String url_val = server.arg("url");
        String uid_val = server.arg("uid");
        
        // Save to EEPROM
        EEPROM.writeString(EEPROM_SSID_ADDR, ssid_val);
        EEPROM.writeString(EEPROM_PASS_ADDR, pass_val);
        EEPROM.writeString(EEPROM_URL_ADDR, url_val);
        EEPROM.writeString(EEPROM_UID_ADDR, uid_val);
        EEPROM.commit();
        
        Serial.println("Configuration saved!");
        Serial.print("SSID: ");
        Serial.println(ssid_val);
        Serial.print("URL: ");
        Serial.println(url_val);
        Serial.print("UID: ");
        Serial.println(uid_val);
        
        server.send(200, "text/html", "<h1>Configuration saved! Restarting...</h1>");
        delay(2000);
        ESP.restart();
    } else {
        server.send(400, "text/html", "<h1>Missing configuration parameters</h1>");
    }
}

/**
 * Handle capture endpoint
 */
void handleCapture() {
    captureAndUpload();
    server.send(200, "application/json", "{\"message\": \"Capture initiated\"}");
}

/**
 * Base64 encoding helper
 */
namespace base64 {
    const char* alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    
    String encode(uint8_t* data, size_t len) {
        String encoded = "";
        int val = 0;
        int valb = 0;
        
        for (size_t i = 0; i < len; i++) {
            val = (val << 8) + data[i];
            valb += 8;
            while (valb >= 6) {
                valb -= 6;
                encoded += alphabet[(val >> valb) & 0x3F];
            }
        }
        
        if (valb > 0) {
            encoded += alphabet[(val << (6 - valb)) & 0x3F];
        }
        
        while (encoded.length() % 4) {
            encoded += "=";
        }
        
        return encoded;
    }
}
