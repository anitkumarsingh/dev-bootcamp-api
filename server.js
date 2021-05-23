const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT;
// Routes
app.get('/api/v1/bootcamp', (req, res) => {
  res.json({
    success: true,
    msg: 'Show all bootcamps'
  });
});

app.get('/api/v1/bootcamp/:id', (req, res) => {
  res.json({
    success: true,
    msg: 'Get single bootcamps'
  });
});

app.post('/api/v1/bootcamp', (req, res) => {
  res.json({
    success: true,
    msg: 'Create a bootcamps'
  });
});

app.put('/api/v1/bootcamp/:id', (req, res) => {
  res.json({
    success: true,
    msg: `Update a bootcamps ${req.params.id}`
  });
});

app.delete('/api/v1/bootcamp/:id', (req, res) => {
  res.json({
    success: true,
    msg: `Delete a bootcamps ${req.params.id}`
  });
});

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
