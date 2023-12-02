const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://bhaskar:r123r456@cluster0.pym3mcr.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Your routes and logic for handling image uploads
app.use(bodyParser.json());
app.use(cors());
app.listen(port,'192.168.10.16', () => {
  console.log(`Server is running on port ${port}`);
});

const imageSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
});

const ImageModel = mongoose.model('Image', imageSchema);

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Save the image to MongoDB
    const image = new ImageModel({
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    const savedImage = await image.save();
    res.json({uploaded :'successful'});
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/latest-image', async (req, res) => {
  try {
    const latestImage = await ImageModel.findOne().sort({ _id: -1 }).exec();

    if (!latestImage) {
      return res.status(404).send('No images found');
    }

    res.json({
      data: latestImage.data,
      contentType: latestImage.contentType,
    });
  } catch (error) {
    console.error('Error fetching latest image:', error);
    res.status(500).send('Internal Server Error');
  }
});