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
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")


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
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/

app.use(require("./routes/static"));

// Index Route
//app.get("/", function(req, res) {
  //res.render("index", { title: "Home" });
//});
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
