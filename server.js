// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const routes = require('./app/routes/index');
//
// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/node-mongodb-crud', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
//
// const server = express();
//
// // Enable CORS
// server.use(cors());
//
// // Serve static files
// server.use(express.static('public'));
//
// // Parse request bodies
// server.use(bodyParser.urlencoded({extended: true}));
// server.use(bodyParser.json());
//
// // Routes
// server.use('/', routes);
//
// // Start the server
// server.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });


const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
    origin: "http://localhost:8080",
    // origin: "http://localhost:8081"
};
app.use('/uploads', express.static('uploads'));
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

const db = require("./app/models");
const Role = db.role;

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

// simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to MEVN application."});
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/author.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/tag.routes")(app);
require("./app/routes/post.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
    try {
        const count = await Role.estimatedDocumentCount();

        if (count === 0) {
            await Promise.all([
                new Role({name: "user"}).save(),
                new Role({name: "moderator"}).save(),
                new Role({name: "admin"}).save()
            ]);

            console.log("Added 'user', 'moderator', and 'admin' to roles collection");
        }
    } catch (err) {
        console.log("Error", err);
    }
}
