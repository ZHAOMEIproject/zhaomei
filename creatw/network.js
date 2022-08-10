const express = require("express");
const app = express();

app.use("/v1/contractapi", require("./contractapi"));

const express = require("express");
const router = express.Router();