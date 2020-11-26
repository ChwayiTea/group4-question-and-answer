const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config')

/*
//middleware posts out on the console/terminal
app.use(auth);
app.use('/ques', () => {
    console.log("Middleware running");
});
*/

//middleware
app.use(cors());
app.use(bodyParser.json());

//import routes
const postsRoute = require('./routes/posts');
const { remove } = require('./models/Post');
app.use('/posts', postsRoute);


//Routes

app.get('/', (req, res) => {
    res.send("We are on home page")
});

//connect to DB
mongoose.connect(
    process.env.DB_CONNECTION, { useUnifiedTopology: true }, { useNewUrlParser: true },
    () => console.log("connected to DB")
);


//listen to server
app.listen(1452);