var express = require("express");
var app = express();

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

const Comments = sequelize.define("Comments", {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
(async () => {
  await Comments.sync();
})();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// set the view engine to ejs
app.set("view engine", "ejs");

// use res.render to load up an ejs view file

// index page
app.get("/", async function (req, res) {
  const comments = await Comments.findAll();

  res.render("index", { comments: comments });
});

app.post("/create", async function (req, res) {
  console.log(req.body);

  const { content } = req.body;

  // Create a new user
  const jane = await Comments.create({ content: content });
  console.log("Jane's auto-generated ID:", jane.id);

  res.redirect("/");
});

app.post("/update/:id", async function (req, res) {
  console.log(req.params);
  console.log(req.body);

  const { content } = req.body;
  const { id } = req.params;

  await Comments.update(
    { content: content },
    {
      where: {
        id: id,
      },
    }
  );

  res.redirect("/");
});

app.post("/delete/:id", async function (req, res) {
  console.log(req.body);

  const { content } = req.body;

  await Comments.destroy({
    where: {
      id: id,
    },
  });

  res.redirect("/");
});

app.listen(8080);
console.log("Server is listening on port 8080");
