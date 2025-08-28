require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes");;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started running at port ${PORT}`);
});
