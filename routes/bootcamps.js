const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    msg: 'Show all bootcamps'
  });
});

router.get('/:id', (req, res) => {
  res.json({
    success: true,
    msg: 'Get single bootcamps'
  });
});

router.post('/', (req, res) => {
  res.json({
    success: true,
    msg: 'Create a bootcamps'
  });
});

router.put('/:id', (req, res) => {
  res.json({
    success: true,
    msg: `Update a bootcamps ${req.params.id}`
  });
});

router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    msg: `Delete a bootcamps ${req.params.id}`
  });
});

module.exports = router;
