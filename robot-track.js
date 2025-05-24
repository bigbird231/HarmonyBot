// Mock database of users and their chat histories
const mockDatabase = {
  nick: {
    timi: {
      password: "1234",
      chatHistory: [
        {
          type: "user",
          message: "Hello.",
          timestamp: "2025-05-25 15:15:00",
        },
        {
          type: "robot",
          message:
            "Hi! How are you today? Is there anything you want to talk about or any questions you have for me? I'm here to have fun and chat with you!",
          timestamp: "2025-05-25 15:15:20",
        },
        {
          type: "user",
          message: "What do you like?",
          timestamp: "2025-05-25 15:16:00",
        },
        {
          type: "robot",
          message:
            "Well, I like many things! I like talking to you, for example. I also like learning new things and exploring different topics. Do you have any hobbies or things you really enjoy doing? Maybe we can talk about those!",
          timestamp: "2025-05-25 15:16:30",
        },
        {
          type: "user",
          message: "How many planets are there in the solar system?",
          timestamp: "2025-05-25 15:17:00",
        },
        {
          type: "robot",
          message:
            "There are eight planets in the solar system. They are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet is unique and has its own characteristics. Have you ever wondered what it would be like to visit another planet?",
          timestamp: "2025-05-25 15:17:20",
        },
        {
          type: "user",
          message: "Yes.",
          timestamp: "2025-05-25 15:18:40",
        },
        {
          type: "robot",
          message:
            "That's really cool! Exploring other planets would be an amazing adventure. Scientists are constantly learning more about our solar system and the planets within it. Maybe one day, humans will be able to travel to other planets and explore them up close. What planet would you most like to visit?",
          timestamp: "2025-05-25 15:19:10",
        },
        {
          type: "user",
          message: "Super as in the planet's made out of gas.",
          timestamp: "2025-05-25 15:20:20",
        },
        {
          type: "robot",
          message:
            "Oh, you might be talking about Jupiter! It's the largest planet in our solar system and is made mostly of gas. It's so big that over 1,000 Earths could fit inside it. Jupiter has some really cool features, like the Great Red Spot, which is a huge storm that's been raging for hundreds of years. Do you want to know more about Jupiter or any of the other planets?",
          timestamp: "2025-05-25 15:20:50",
        },
        {
          type: "user",
          message: "Yes.",
          timestamp: "2025-05-25 15:21:30",
        },
        {
          type: "robot",
          message:
            "Well, let's talk about Saturn. It's famous for its beautiful rings. These rings are made up of ice and dust particles. Saturn is also a gas giant, like Jupiter. It has many moons, and one of them, Titan, is really interesting because it has a thick atmosphere and lakes of liquid methane. Isn't it amazing how diverse our solar system is?",
          timestamp: "2025-05-25 15:22:20",
        },
        {
          type: "user",
          message: "How many stars are in the spice?",
          timestamp: "2025-05-25 15:24:00",
        },
        {
          type: "robot",
          message:
            "Oh, that's a great question!But it's a really hard one to answer because there are so many stars in the universe. Scientists estimate that there are at least 100 billion galaxies in the observable universe, and each galaxy contains billions or even trillions of stars. So, the number of stars in the universe is truly mind-boggling.But even though we can't count them all, we can still enjoy looking up at the night sky and imagining all the amazing things that are out there. Do you like looking at the stars?",
          timestamp: "2025-05-25 15:24:30",
        },
      ],
    },
  },
}

// Handle form submission
document.getElementById("trackForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const userId = document.getElementById("userId").value.trim()
  const robotId = document.getElementById("robotId").value.trim()
  const password = document.getElementById("password").value.trim()

  // Show loading state
  const btnText = document.querySelector(".btn-text")
  const btnLoading = document.querySelector(".btn-loading")
  const searchBtn = document.querySelector(".search-btn")

  btnText.style.display = "none"
  btnLoading.style.display = "inline"
  searchBtn.disabled = true

  // Hide previous results
  document.getElementById("chatHistory").style.display = "none"
  document.getElementById("errorMessage").style.display = "none"

  // Simulate API call delay
  setTimeout(() => {
    // Reset button state
    btnText.style.display = "inline"
    btnLoading.style.display = "none"
    searchBtn.disabled = false

    // Check credentials
    if (mockDatabase[userId] && mockDatabase[userId][robotId] && mockDatabase[userId][robotId].password === password) {
      // Display chat history
      displayChatHistory(userId, robotId, mockDatabase[userId][robotId].chatHistory)
    } else {
      // Show error message
      document.getElementById("errorMessage").style.display = "block"
    }
  }, 1500) // 1.5 second delay to simulate loading
})

function displayChatHistory(userId, robotId, chatHistory) {
  // Update display info
  document.getElementById("displayUserId").textContent = userId
  document.getElementById("displayRobotId").textContent = robotId
  document.getElementById("lastUpdated").textContent = new Date().toLocaleString()

  // Clear previous messages
  const chatMessages = document.getElementById("chatMessages")
  chatMessages.innerHTML = ""

  // Add messages
  chatHistory.forEach((message) => {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${message.type}`

    messageDiv.innerHTML = `
      <div class="message-content">${message.message}</div>
      <div class="message-time">${formatTimestamp(message.timestamp)}</div>
    `

    chatMessages.appendChild(messageDiv)
  })

  // Show chat history section
  document.getElementById("chatHistory").style.display = "block"

  // Scroll to chat history
  document.getElementById("chatHistory").scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Add some demo credentials info
document.addEventListener("DOMContentLoaded", () => {
  // Add a small info box with demo credentials
  const formContainer = document.querySelector(".track-form-container")
  const demoInfo = document.createElement("div")
  demoInfo.className = "demo-info"
  demoInfo.innerHTML = `
    <div style="background-color: #e8f4fd; border: 1px solid #bee5eb; border-radius: 4px; padding: 1rem; margin-bottom: 1rem; font-size: 0.9rem;">
      <strong>Demo Credentials:</strong><br>
      User ID: nick, Robot ID: timi, Password: 1234<br>
    </div>
  `

  formContainer.insertBefore(demoInfo, formContainer.firstChild)
})
