const express = require("express");
// const connectDB = require("./config/db");
// const routes = require("./routes/api/books");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.get('/', (req, res) => res.send('Hello world!'));

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));