/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const expressMessages = require("express-messages");
const dotenv = require("dotenv").config();
const app = express();
const pool = require('./database/');
const utilities = require("./utilities/");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const bodyParser = require("body-parser");

/* ***********************
 * EJS Configuration
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // layout.ejs na pasta layouts

/* ***********************
 * Static Files
 *************************/
app.use(express.static("public"));

/* ***********************
 * Session and Flash
 *************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET || "default_secret", // Use valor padrão se não estiver no .env
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
  })
);
app.use(flash());

// Middleware para disponibilizar mensagens flash às views
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res); // Adiciona messages() às views
  next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * Routes
 *************************/
// Página inicial
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/account", require("./routes/accountRoute"))
// Rotas estáticas
app.use(require("./routes/static"));

// Rotas de inventário
app.use("/inv", inventoryRoute);


/* ***********************
 * Error Handling
 *************************/
// Erro 404 - Página não encontrada
app.use((req, res, next) => {
  const err = {
    status: 404,
    message: "Sorry, we appear to have lost that page.",
  };
  next(err); // Encaminha o erro para o middleware de erro geral
});

// Middleware de erro geral
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at "${req.originalUrl}": ${err.message}`);
  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Server Configuration
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
