/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const env = require("dotenv").config()
const app = express()

/* ***********************
 * Routes
 *************************/

/* ***********************
 * EJS
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // layout.ejs na pasta layouts

// Configuração para arquivos estáticos (CSS, JS, etc.)
app.use(express.static("public"));

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/

app.use(require("./routes/static"));

// Index Route
app.get("/", function(req, res) {
  res.render("index", { title: "Home" });
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
