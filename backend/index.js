let express = require('express');
let app = express();

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


const uri = 'mongodb+srv://bhaskar:r123r456@cluster0.pym3mcr.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var db , collection,findResult; 
  async function createDb(){
    await client.connect();
     db = client.db("todoappdb");
     collection = db.collection('todoappcollection');
     findResult = await collection.find({}).toArray();
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
server.listen(port, () => {
   console.log(`started on port: ${port}`);
});



// API CALL WITH MONGODB DATA 

app.get('/api/users', async (req, res) => {
  try {
   await createDb()
   await client.connect();
    console.log(findResult ,"result")
    res.json(findResult)
  }  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API POST CALL TO UPDATE MONGO DB DATA

app.post('/api/update', async(req , res )=>{
  try{
    await createDb()
    collection.find({}).insertOne(req.body , function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    })
    res.json(req.body)
  }catch(error){
    res.status(500).json({error : error.message})
  }
})

