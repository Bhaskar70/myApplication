let express = require('express');
let app = express();
const mongoose = require('mongoose');

const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

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
  socket.on('join', (data) => {
    socket.join(data.room);
    socket.broadcast.to(data.room).emit('user joined');
  });

  socket.on('message', (data) => {
    io.in(data.room).emit('new message', { user: data.user, message: data.message });
  });
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

// API POST CALL TO UPDATE MONGO DB DATA

// app.post('/api/update/chats', async (req, res) => {
//   try {
//     await createDb()
//     let dataUpdate = findResult.filter(res => res && res.roomId == req.body.roomId)
//     if (dataUpdate.length && dataUpdate[0].roomId === req.body.roomId) {
//       console.log(dataUpdate[0].roomId, "64::::", req.body.roomId)
//       const filter = { roomId: { $gte: req.body.roomId } };
//       const update = { $set: { chats: req.body.chats } };
//       chatExists = true
//       collection.updateOne(filter, update, (err, result) => {
//         if (err) {
//           console.error('Error updating documents:', err);
//         } else {
//           console.log('Documents updated:', result.modifiedCount);
//         }
//       });

//     } else {
//       collection.insertOne(req.body, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//       })
//     }

//     res.json(req.body)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })



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
    if(findUserData.length){
      Object.keys(req.body).forEach((val, i)=>{
         const filter = {id : Number(val)}
         const dynamicKey = `roomId.${findUserData.length+1}`;
        console.log(req.body[val] , val ,"111" , findUserData.length +1)
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
