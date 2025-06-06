// Mock database of users and their chat histories
const mockDatabase = {
  nick: {
    timi: {
      password: "1234",
      chatHistory: [
        {
          type: "user",
          message: "Hello.",
          timestamp: "2025-05-24 15:15:00",
        },
        {
          type: "robot",
          message:
            "Hi! How are you today? Is there anything you want to talk about or any questions you have for me? I'm here to have fun and chat with you!",
          timestamp: "2025-05-24 15:15:21",
        },
        {
          type: "user",
          message: "What do you like?",
          timestamp: "2025-05-24 15:16:07",
        },
        {
          type: "robot",
          message:
            "Well, I like many things! I like talking to you, for example. I also like learning new things and exploring different topics. Do you have any hobbies or things you really enjoy doing? Maybe we can talk about those!",
          timestamp: "2025-05-24 15:16:30",
        },
        {
          type: "user",
          message: "How many planets are there in the solar system?",
          timestamp: "2025-05-24 15:17:02",
        },
        {
          type: "robot",
          message:
            "There are eight planets in the solar system. They are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet is unique and has its own characteristics. Have you ever wondered what it would be like to visit another planet?",
          timestamp: "2025-05-24 15:17:19",
        },
        {
          type: "user",
          message: "Yes.",
          timestamp: "2025-05-24 15:18:40",
        },
        {
          type: "robot",
          message:
            "That's really cool! Exploring other planets would be an amazing adventure. Scientists are constantly learning more about our solar system and the planets within it. Maybe one day, humans will be able to travel to other planets and explore them up close. What planet would you most like to visit?",
          timestamp: "2025-05-24 15:19:16",
        },
        {
          type: "user",
          message: "Super as in the planet's made out of gas.",
          timestamp: "2025-05-24 15:20:20",
        },
        {
          type: "robot",
          message:
            "Oh, you might be talking about Jupiter! It's the largest planet in our solar system and is made mostly of gas. It's so big that over 1,000 Earths could fit inside it. Jupiter has some really cool features, like the Great Red Spot, which is a huge storm that's been raging for hundreds of years. Do you want to know more about Jupiter or any of the other planets?",
          timestamp: "2025-05-24 15:20:49",
        },
        {
          type: "user",
          message: "Yes.",
          timestamp: "2025-05-24 15:21:33",
        },
        {
          type: "robot",
          message:
            "Well, let's talk about Saturn. It's famous for its beautiful rings. These rings are made up of ice and dust particles. Saturn is also a gas giant, like Jupiter. It has many moons, and one of them, Titan, is really interesting because it has a thick atmosphere and lakes of liquid methane. Isn't it amazing how diverse our solar system is?",
          timestamp: "2025-05-24 15:22:28",
        },
        {
          type: "user",
          message: "Yes.",
          timestamp: "2025-05-24 15:23:30",
        },
        {
          type: "robot",
          message:
            "Great! So, have you ever seen a picture of Saturn's rings? They're really spectacular. Scientists have been studying Saturn for a long time, and there's still so much we don't know about it. Another interesting thing about Saturn is that it has a hexagon-shaped storm at its north pole. It's like a big, six-sided cloud formation. Isn't that strange and cool at the same time?",
          timestamp: "2025-05-24 15:23:45",
        },
        {
          type: "user",
          message: "Yes.",
          timestamp: "2025-05-24 15:24:32",
        },
        {
          type: "robot",
          message:
            "That's awesome! Saturn is definitely a fascinating planet. Another planet that's worth mentioning is Mars. It's often called the Red Planet because of its reddish appearance. Mars has a very thin atmosphere, and it's home to the largest volcano in the solar system, Olympus Mons. Scientists are really interested in Mars because they think there might have been life there in the past. They're also looking into the possibility of sending humans to Mars in the future. What do you think about that?",
          timestamp: "2025-05-24 15:24:47",
        },
        {
          type: "user",
          message: "I'm in. It might work.",
          timestamp: "2025-05-24 15:25:33",
        },
        {
          type: "robot",
          message:
            "That's so exciting! Going to Mars would be a huge step for humanity. There are still many challenges to overcome, like the long journey and the harsh environment on Mars. But scientists are working hard to find solutions. Do you know what kind of things astronauts would need to survive on Mars?",
          timestamp: "2025-05-24 15:25:51",
        },
        {
          type: "user",
          message: "How many stars are in the spice?",
          timestamp: "2025-05-24 15:26:46",
        },
        {
          type: "robot",
          message:
            "Oh, that's a great question!But it's a really hard one to answer because there are so many stars in the universe. Scientists estimate that there are at least 100 billion galaxies in the observable universe, and each galaxy contains billions or even trillions of stars. So, the number of stars in the universe is truly mind-boggling.But even though we can't count them all, we can still enjoy looking up at the night sky and imagining all the amazing things that are out there. Do you like looking at the stars?",
          timestamp: "2025-05-24 15:27:12",
        },
        {
          type: "user",
          message: "Yes. No.",
          timestamp: "2025-05-24 15:28:06",
        },
        {
          type: "robot",
          message:
            "Hahaha, that's an interesting answer. Maybe you like looking at the stars sometimes, but other times you're more interested in other things. That's okay! There are so many amazing things to explore in the world. So, what do you like to do when you're not looking at the stars?",
          timestamp: "2025-05-24 15:28:19",
        },
        {
          type: "user",
          message: "Yeah, yeah, yeah. Thank you very much. That helps me a lot. Thanks.",
          timestamp: "2025-05-24 15:28:56",
        },
        {
          type: "robot",
          message:
            "You're welcome! I'm glad I could help. It sounds like you're really interested in space and the universe. That's so cool! Is there anything else you'd like to know about?",
          timestamp: "2025-05-24 15:29:12",
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
  document.getElementById("lastUpdated").textContent = '2025-05-24 15:29:12'

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
