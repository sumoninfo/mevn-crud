const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/node-mongodb-crud', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();

// Serve static files
app.use(express.static('public'));

// Parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/', routes);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
