// Updated frontend API client for production use
class HarmonyBotAPI {
  constructor(baseURL) {
    // Auto-detect API URL based on environment
    if (baseURL) {
      this.baseURL = baseURL
    } else if (typeof window !== "undefined") {
      // Browser environment - use current domain or localhost for development
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"

      if (isLocalhost) {
        this.baseURL = "http://localhost:3000/api"
      } else {
        // Use the same domain as the frontend (for Vercel deployment)
        this.baseURL = `${window.location.protocol}//${window.location.host}/api`
      }
    } else {
      // Node.js environment
      this.baseURL = process.env.API_BASE_URL || "http://localhost:3000/api"
    }

    console.log("HarmonyBot API initialized with base URL:", this.baseURL)
  }

  async makeRequest(endpoint, data = null, method = "GET") {
    try {
      const config = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      if (data && method !== "GET") {
        config.body = JSON.stringify(data)
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      return responseData
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  async healthCheck() {
    return this.makeRequest("/health")
  }

  async getChatHistory(userId, robotId, password) {
    return this.makeRequest(
      "/chat-history",
      {
        userId,
        robotId,
        password,
      },
      "POST",
    )
  }

  async addMessage(userId, robotId, password, message, type = "user") {
    return this.makeRequest(
      "/chat-history/add-message",
      {
        userId,
        robotId,
        password,
        message,
        type,
      },
      "POST",
    )
  }

  async getUserStats(userId, robotId, password) {
    return this.makeRequest(
      "/user-stats",
      {
        userId,
        robotId,
        password,
      },
      "POST",
    )
  }
}

// Global instance for easy access
let harmonyBotAPI

// Initialize API when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  harmonyBotAPI = new HarmonyBotAPI()

  // Test API connection
  harmonyBotAPI
    .healthCheck()
    .then((response) => {
      console.log("✅ API connection successful:", response.message)
      window.toastSuccess("Connected to HarmonyBot API")
    })
    .catch((error) => {
      console.error("❌ API connection failed:", error.message)
      window.toastError("Failed to connect to API. Using offline mode.")
    })
})

// Export for use in other scripts
if (typeof window !== "undefined") {
  window.HarmonyBotAPI = HarmonyBotAPI
  window.toastSuccess = (message) => {
    console.log("Success:", message)
  }
  window.toastError = (message) => {
    console.error("Error:", message)
  }
}
