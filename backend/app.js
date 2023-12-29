let express = require('express');
let app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
const { register } = require('module');
let io = socketIO(server);

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
const yourSchema = new mongoose.Schema({
  id: Number,
  name: String,
  phone: Number,
  image: String,
  roomId: Object
});


const uri = 'mongodb+srv://bhaskar:r123r456@cluster0.pym3mcr.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);
var db, collection, findResult, userDataCollection, findUserData;
async function createDb() {
  await client.connect();
  db = client.db("chatAppdb");
  userDataCollection = db.collection('userDataCollection', yourSchema)
  collection = db.collection('chatDataCollection');
  findResult = await collection.find({}).toArray();
  findUserData = await userDataCollection.find({}).toArray();

}
// SOCKET  CONNECTION 

io.on('connection', (socket) => {
  console.log('connnet to socket')
  socket.on('join', (data) => {
    socket.join(data.room);
    socket.broadcast.to(data.room).emit('user joined');
  });

  // new message 
  socket.on('message', (data) => {
    io.emit('new message', { user: data.user, room: data.room, message: data.message });
  });

  // delete message
  socket.on('delete', (data) => {
    io.emit('new message', { user: data.user, room: data.room, message: data.message });
  });

  // new account created
  socket.on('register', (data) => {
    io.emit('new user', { phone: data.phone })
  })
});
server.listen(port, '192.168.10.16', () => {
  console.log(`started on port: ${port}`);
});



// API CALL WITH MONGODB DATA 

app.get('/api/chats', async (req, res) => {
  try {
    await createDb()
    await client.connect();
    res.json(findResult)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/update/chats', async (req, res) => {
  try {
    await createDb()
    let dataUpdate = findResult.filter(res => res && res.roomId == req.body.roomId)
    if (dataUpdate.length && dataUpdate[0].roomId === req.body.roomId) {
      // const filter = { roomId: { $gte: req.body.roomId } };
      // const update = { $push: { chats: req.message } };
      console.log(req.body)
      collection.updateOne(
        { roomId: req.body.roomId },
        { $push: { chats: req.body.message } }, function (err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        }
      )
    } else {
      collection.insertOne(req.body, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      })
    }

    res.json(req.body)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//  API CALL TO GET REGISTER DATA

app.get('/api/register', async (req, res) => {
  try {
    await createDb()
    await client.connect();
    res.json(findUserData)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API CALL TO UPDATE REGISTER DATA

app.post('/api/update/register', async (req, res) => {
  try {
    await createDb()
    let dataUpdate = findUserData.filter(res => res && res.phone == req.body.phone)
    if (dataUpdate.length) {
      res.json({ valid: false });
    } else {
      userDataCollection.insertOne(req.body, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      })
      res.json({ valid: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/update/roomid', async (req, res) => {
  try {
    await createDb()
    if (findUserData.length) {
      Object.keys(req.body).forEach((val, i) => {
        const filter = { id: Number(val) }
        const dynamicKey = `roomId.${findUserData.length + 1}`;
        console.log(req.body[val], val, "111", findUserData.length + 1)
        const update = { $set: { [dynamicKey]: req.body[val] } };
        userDataCollection.updateOne(filter, update, (err, result) => {
          if (err) {
            console.error('Error updating documents:', err);
          } else {
            console.log('Documents updated:', result.modifiedCount);
          }
        });
      })
    }
    res.json({})
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// mark all read

app.post('/api/markasread', async (req, res) => {
  try {
    await createDb()
    console.log(req.body, "123:::")
    const { roomId, user } = req.body
    collection.updateMany(
      { roomId: roomId },
      { $set: { 'chats.$[elem].read': true } },
      { arrayFilters: [{ 'elem.user': user }] }, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      }
    )
    res.json({})
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


// image uploading functionality

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Connect to the MongoDB server
    await client.connect();

    // Select the database
    const imagedb = client.db('test');

    // Insert image information into the collection
    const imagecollection = imagedb.collection('images');
    const result = await imagecollection.insertOne({
      filename: req.file.originalname,
      filepath: req.file.path,
    });

    console.log(`Image uploaded with ID: ${result.insertedId}`);

    res.json({ message: 'Image uploaded successfully' });
  } finally {
    // Close the connection
    await client.close();
  }
});

// api for delete message

app.post('/api/delete/msg', async (req, res) => {
  try {
    await createDb()
    console.log(req.body, "delete:::")
    const { roomId, user, deleteForUser, time, message } = req.body
    collection.updateMany(
      { roomId: roomId },
      { $set: { 'chats.$[elem].isDeleted': deleteForUser } },
      {
        arrayFilters: [
          {
            $and: [
              { 'elem.time': time },
              { 'elem.user': user },
              { 'elem.message': message },
            ],
          },
        ]
      }, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      }
    )
    res.json({})
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})