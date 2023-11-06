const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const { authJWT } = require("./app/middelware/middleware");
app.use(authJWT);

app.get("*", (req, res) => {
  res.status(400).send({
    message: "Hunn smart!",
    error: true,
  });
});

require("./app/route/auth")(app);

const port = 4400;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
