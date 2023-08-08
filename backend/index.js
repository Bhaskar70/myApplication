let express = require('express');

let app = express();

// Require the MongoDB client
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./user'); 
let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());
// MongoDB connection URI (replace 'your-mongodb-uri' with your actual connection URI)
const uri = 'mongodb+srv://bhaskar:r123r456@cluster0.pym3mcr.mongodb.net/?retryWrites=true&w=majority';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect('mongodb+srv://bhaskar:r123r456@cluster0.pym3mcr.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('user joined');
    });

    socket.on('message', (data) => {
        io.in(data.room).emit('new message', {user: data.user, message: data.message});
        app.get('/api/users', async (req, res) => {
          try {
            // Fetch data from MongoDB
            const users = await User.find();
            console.log("user :",)
            res.json({data:'hjdfhshdfhdfhjfh'})
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        });
    });
});
server.listen(port, () => {
    console.log(`started on port: ${port}`);
});




// Function to connect to the database and execute operations
async function connectToDatabase() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');


    // Example: Insert a document into a collection
    const db = client.db();
    const collection = db.collection('userData');
    const document = { name: 'John Doe', age: 30, email: 'john@example.com' };
    const result = await collection.insertOne(document);

    // Example: Find documents in a collection
    const findResult = await collection.find({ name: 'John Doe' }).toArray();

    // Close the connection to the MongoDB server
    await client.close();
    console.log('Connection to MongoDB closed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Call the function to connect to the database and perform operations
connectToDatabase();

