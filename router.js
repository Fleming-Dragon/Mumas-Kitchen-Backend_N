const express = require('express');
const router = express.Router();

// Define a default route for testing
router.get('/', (req, res) => {
  res.send('Welcome to the router!');
});

module.exports = router;
