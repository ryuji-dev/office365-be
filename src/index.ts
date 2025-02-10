import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 3000;

mongoose
  .connect('mongodb://127.0.0.1:27017/office365db', {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
