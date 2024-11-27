const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    if (file.fieldname === 'xml' && !file.originalname.endsWith('.xml')) {
      return cb(new Error('Only XML files are allowed'));
    }
    cb(null, true);
  }
});

// Upload endpoint
app.post('/upload', upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'xml', maxCount: 1 }
]), (req, res) => {
  try {
    const { ruc } = req.body;
    const files = req.files;

    if (!files.pdf || !files.xml) {
      return res.status(400).json({ error: 'Both PDF and XML files are required' });
    }

    res.json({
      message: 'Files uploaded successfully',
      data: {
        ruc,
        pdf: files.pdf[0].filename,
        xml: files.xml[0].filename
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});