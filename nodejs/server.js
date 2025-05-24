const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const User = require("./models/User")
const Robot = require("./models/Robot")
const Chat = require("./models/Chat")
const Message = require("./models/Message")
const { initialRobots } = require("./utils/initialRobots")

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Connected to MongoDB")

    // Check if robots are already initialized
    const robotCount = await Robot.countDocuments()
    if (robotCount === 0) {
      // Initialize robots
      await Robot.insertMany(initialRobots)
      console.log("🤖 Initial robots added to the database.")
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    throw error // Propagate the error to be caught by the caller
  }
}

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API is healthy" })
})

// User Registration
app.post("/api/register", async (req, res) => {
  try {
    const { userId, password } = req.body

    // Validate userId and password
    if (!userId || !password) {
      return res.status(400).json({ message: "User ID and password are required." })
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ userId })
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const newUser = new User({
      userId,
      password: hashedPassword,
    })

    // Save the user to the database
    await newUser.save()

    // Respond with success message
    res.status(201).json({ message: "User registered successfully." })
  } catch (error) {
    console.error("Error registering user:", error)
    res.status(500).json({ message: "Error registering user." })
  }
})

// User Login
app.post("/api/login", async (req, res) => {
  try {
    const { userId, password } = req.body

    // Validate userId and password
    if (!userId || !password) {
      return res.status(400).json({ message: "User ID and password are required." })
    }

    // Find the user in the database
    const user = await User.findOne({ userId })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "1h" })

    // Respond with the token
    res.status(200).json({ token })
  } catch (error) {
    console.error("Error logging in user:", error)
    res.status(500).json({ message: "Error logging in user." })
  }
})

// Get All Robots
app.get("/api/robots", async (req, res) => {
  try {
    const robots = await Robot.find()
    res.status(200).json(robots)
  } catch (error) {
    console.error("Error fetching robots:", error)
    res.status(500).json({ message: "Error fetching robots." })
  }
})

// Get Chat History
app.post("/api/chat-history", async (req, res) => {
  try {
    const { userId, robotId } = req.body

    // Validate userId and robotId
    if (!userId || !robotId) {
      return res.status(400).json({ message: "User ID and Robot ID are required." })
    }

    // Find the chat between the user and the robot
    let chat = await Chat.findOne({ userId, robotId })

    // If the chat doesn't exist, create a new chat
    if (!chat) {
      chat = new Chat({ userId, robotId })
      await chat.save()
    }

    // Populate the messages in the chat
    await chat.populate("messages")

    // Respond with the chat history
    res.status(200).json(chat.messages)
  } catch (error) {
    console.error("Error fetching chat history:", error)
    res.status(500).json({ message: "Error fetching chat history." })
  }
})

// Save Message
app.post("/api/save-message", async (req, res) => {
  try {
    const { userId, robotId, text, sender } = req.body

    // Validate userId, robotId, text, and sender
    if (!userId || !robotId || !text || !sender) {
      return res.status(400).json({ message: "User ID, Robot ID, text, and sender are required." })
    }

    // Find the chat between the user and the robot
    let chat = await Chat.findOne({ userId, robotId })

    // If the chat doesn't exist, create a new chat
    if (!chat) {
      chat = new Chat({ userId, robotId })
      await chat.save()
    }

    // Create a new message
    const newMessage = new Message({
      chat: chat._id,
      text,
      sender,
    })

    // Save the message to the database
    await newMessage.save()

    // Add the message to the chat
    chat.messages.push(newMessage._id)
    await chat.save()

    // Respond with success message
    res.status(201).json({ message: "Message saved successfully." })
  } catch (error) {
    console.error("Error saving message:", error)
    res.status(500).json({ message: "Error saving message." })
  }
})

const PORT = process.env.PORT || 3000

// Start server (only if not in serverless environment)
async function startServer() {
  await initializeDatabase()

  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`🚀 HarmonyBot API Server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
      console.log(`💬 Chat history endpoint: POST http://localhost:${PORT}/api/chat-history`)
      console.log(`\n📝 Test credentials:`)
      console.log(`   User ID: nick`)
      console.log(`   Robot ID: timi`)
      console.log(`   Password: 1234`)
    })
  }
}

// Initialize for both local and serverless
initializeDatabase().catch(console.error)

// Start server only in local development
if (require.main === module) {
  startServer().catch(console.error)
}

// For Vercel deployment
module.exports = app
