const express = require('express'); // Change const express = require('express') to import express from express
const router = express.Router();
const  MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const session = require('express-session');  // Add session
const http = require('http');
const cors = require('cors');
const {Server}  = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 9000;
app.use(cors());   

// MongoDB URI and DB name
const MONGODB_URI = "mongodb+srv://et523:zzclDLjLXs7Cvsan@cluster0.dpz3g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "mo_chat";
let db;

const secretKey = 'secret_key';

app.use(session({
  secret: 'ultra_top_secret',
  resave: false,
  saveUninitialized: true
}));

app.use(cors({
  origin: "http://localhost:9000", 
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

  
  // Connect to MongoDB
  MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
      db = client.db(DB_NAME);
      console.log('Connected to MongoDB');
      initializeCollections(db);
      // Start the server only after the DB connection is successful
      app.listen(PORT, () => {
          console.log(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch(err => console.error("Error connecting to MongoDB:", err));
  
  app.use(express.json());
  app.use(express.static(path.join(__dirname)));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

// Setup body parsing for JSON and FormData
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Signup Route
app.post('/signup', (req, res) => {
    const { email, password } = req.body;
  
    db.collection('users').insertOne({ email, password, username: email.split('@')[0] })
        .then(() => res.json({ success: true, message: 'Signup successful' }))
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: 'An error occurred during signup' });
        });
  });


// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.collection('users').findOne({ email, password })
      .then(user => {
          if (user) {
              const token = jwt.sign({ username: user.username, email: user.email }, secretKey, { expiresIn: '1h' });
              req.session.user = { email: user.email, username: user.username };
              res.json({ success: true, message: 'Login successful', token, userId: user._id });
          } else {
              res.status(400).json({ success: false, message: 'Invalid email or password' });
          }
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ success: false, message: 'An error occurred during login' });
      });
});

// Middleware for JWT authentication
function authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.user = decoded;
        next();
    });
  }

// Search Users Route
app.get('/all-users', authenticate, async (req, res) => {
    const { query } = req.query;
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({ username: { $regex: query, $options: 'i' } }).toArray();
    res.json({ users });
  });
  
  // Send friend request 
  app.post('/friend-request', authenticate, async (req, res) => {
    const { targetUsername } = req.body;
    const userCollection = db.collection('users');
    const friendRequestsCollection = db.collection('friendRequests');
  
    const targetUser = await userCollection.findOne({ username: targetUsername });
    if (!targetUser) return res.status(400).json({ message: 'User not found.' });
  
    const existingRequest = await friendRequestsCollection.findOne({ from: req.user.username, to: targetUsername });
    if (existingRequest) return res.status(400).json({ message: 'Friend request already sent.' });
  
    await friendRequestsCollection.insertOne({ from: req.user.username, to: targetUsername, status: 'pending' });
    res.status(200).json({ message: 'Friend request sent.' });
  });
  
  // Accept friend request 
  app.post('/accept-friend', authenticate, async (req, res) => {
    const { fromUsername } = req.body;
    const friendRequestsCollection = db.collection('friendRequests');
    const friendsCollection = db.collection('friends');
  
    const request = await friendRequestsCollection.findOne({ from: fromUsername, to: req.user.username, status: 'pending' });
    if (!request) return res.status(400).json({ message: 'No pending friend request.' });
  
    await friendRequestsCollection.updateOne({ _id: request._id }, { $set: { status: 'accepted' } });
    await friendsCollection.insertOne({ user1: req.user.username, user2: fromUsername });
    res.status(200).json({ message: 'Friend request accepted.' });
  });
  
  // Get friends list 
  app.get('/friends', authenticate, async (req, res) => {
    const friendsCollection = db.collection('friends');
    try {
        const friends = await friendsCollection.find({
            $or: [{ user1: req.user.username }, { user2: req.user.username }]
        }).toArray();
  
        const friendUsernames = new Set(
            friends.map(friend => (friend.user1 === req.user.username ? friend.user2 : friend.user1))
        );
  
        res.json({ success: true, friends: Array.from(friendUsernames) });
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ success: false, message: 'Error fetching friends.' });
    }
  });
  
  // Get pending friend requests
  app.get('/friend-requests', authenticate, async (req, res) => {
      const friendRequestsCollection = db.collection('friendRequests');
  
      try {
          const requests = await friendRequestsCollection
              .find({ to: req.user.username, status: 'pending' })
              .toArray();
          res.status(200).json({ success: true, requests });
      } catch (error) {
          console.error('Error fetching friend requests:', error);
          res.status(500).json({ success: false, message: 'Error fetching friend requests.' });
      }
  });
  
    // Route to check session and user info
app.get('/session', (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false });
  }
});
  // Decline friend request 
  app.post('/decline-friend', authenticate, async (req, res) => {
    const { fromUsername } = req.body;
    const friendRequestsCollection = db.collection('friendRequests');
  
    const result = await friendRequestsCollection.deleteOne({
        from: fromUsername,
        to: req.user.username,
        status: 'pending'
    });
  
    if (result.deletedCount > 0) {
        res.status(200).json({ success: true, message: 'Friend request declined.' });
    } else {
        res.status(400).json({ success: false, message: 'No pending friend request found.' });
    }
  });


  const initializeCollections = async (db) => {
    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    const collectionNames = collections.map((col) => col.name);

    if (!collectionNames.includes("messages")) {
        await db.createCollection("messages");
        console.log("Created 'messages' collection");
    }
    
    if (!collectionNames.includes("chats")) {
        await db.createCollection("chats");
        console.log("Created 'chats' collection");
    }
};


//Creates a chat room
const ensureChatRoomExists = async (username, friend) => {
  const room = [username, friend].sort().join("-");
  const chatsCollection = db.collection("chats");
  const existingChat = await chatsCollection.findOne({ room });
  if(existingChat)
    {
      console.log("Existing Chat Room:", room);
    }
  else 
  {
    console.log("No Existing Chat Room:", room);
  }
  if (!existingChat) {
      await chatsCollection.insertOne({ room, participants: [username, friend], createdAt: new Date() });
      console.log(`Created new chat room: ${room}`);
  }
  return room; // Return the room name
};


// Store chat messages
const saveMessage = async (room, messageData) => {
  try {
      const messagesCollection = db.collection("messages");
      await messagesCollection.insertOne({ room, ...messageData });
      console.log(`Message saved in room: ${room}`);
  } catch (err) {
      console.error("Error saving message:", err);
      throw err; // Propagate the error to handle appropriately
  }
};

// Fetch chat messages and create a chat if it doesn't exist
app.get("/chat/:friend", async (req, res) => {
  const { friend } = req.params;
  const username = req.session.user?.username; // Ensure authenticated user

  if (!username) {
    return res.status(401).json({ success: false, message: "Unauthorized access." });
  }

  console.log(`Fetching messages between ${username} and ${friend}`);

  try {
    // First check: messages in `-username` with `friend`
    const firstRoom = `-${username}`;
    const secondRoom = `-${friend}`;

    console.log(`Checking messages in rooms: ${firstRoom} and ${secondRoom}`);

    // Fetch messages where `room` is `-username` or `-friend` and either user sent the message
    const messages = await db.collection("messages")
      .find({
        $or: [
          { room: firstRoom, from: username },
          { room: firstRoom, from: friend },
          { room: secondRoom, from: username },
          { room: secondRoom, from: friend }
        ]
      })
      .sort({ timestamp: 1 }) // Sort messages by time (oldest to newest)
      .project({ _id: 0, from: 1, message: 1, timestamp: 1 }) // Include only relevant fields
      .toArray();

    console.log("Messages:", messages);
    res.json({ success: true, messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, message: "Failed to fetch messages." });
  }
});



// Save a message to the database
app.post("/save-message", authenticate, async (req, res) => {
  const room = req.body.room;
  const from = req.user.username;
  const message = req.body.message;
  const timestamp = new Date();
  console.log("Request Details:");
  console.log("Room:", room);
  console.log("From:", from);
  console.log("Message:", message);	
  console.log("Timestamp:", timestamp);
  if (!room || !from || !message) {
      return res.status(400).json({ success: false, message: "Invalid message data." });
  }

  try {
      await saveMessage(room, { from, message, timestamp });
      res.status(200).json({ success: true, message: "Message saved successfully." });
  } catch (error) {
      console.error("Error saving message:", error);
      res.status(500).json({ success: false, message: "Failed to save message." });
  }
});


io.on("connection", socket => {
  console.log("New client connected");

  // Handle room joining
  socket.on("joinRoom", ({ room }) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
  });

  // Handle sending messages
  socket.on("sendMessage", async ({ room, from, message }) => {
      const timestamp = new Date();
      const messageData = { from, message, timestamp };

      // Save the message in the database
      await saveMessage(room, messageData);

      // Broadcast the message to all clients in the room
      io.to(room).emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
      console.log("User disconnected");
  });
});
