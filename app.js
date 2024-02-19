const express = require("express");
const routes = require("./routes/apis/om2mApis"); // Import your router
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Include your router as middleware
app.use("/", routes);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));
