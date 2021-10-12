const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000" //Permite que se pueda conectar desde otra IP, en este caso el localhost de React
};

app.use(cors(corsOptions));

app.use(express.urlencoded({extended: true}));
app.use(express.json())

const db = require("./app/models");
//Prod
//db.sequelize.sync();

//In development
db.sequelize.sync({ force: true }).then(() => {
    console.log("Borrar y sincronizar");
});

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido al CRUD." });
});

require("./app/routes/book.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});