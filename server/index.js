const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const fileupload = require('express-fileupload');
const authRouter = require('./routes/auth.routes');
const fileRouter = require('./routes/file.routes');
const corsMiddleware = require('./middleware/cors.middleware');
const filepathMiddleware = require('./middleware/filepath.middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || config.get('serverPort');

app.use(fileupload({
  defCharset: 'utf8',
  defParamCharset: 'utf8',
}));
app.use(corsMiddleware);
app.use(filepathMiddleware(path.resolve(__dirname, 'files')));
app.use(express.json());
app.use(express.static('static'));
app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);

const start = async () => {
  try {
    await mongoose.connect(config.get('dbUrl'));
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    
  }
};

start();
