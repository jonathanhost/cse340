/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts");
const express = require("express");
const env = require("dotenv").config();
const app = express();
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");
/* ***********************
 * EJS
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // layout.ejs na pasta layouts

// Configuração para arquivos estáticos (CSS, JS, etc.)
app.use(express.static("public"));
app.get("/", utilities.handleErrors(baseController.buildHome))
/* ***********************
 * Rotas
 *************************/

// Rota para arquivos estáticos
app.use(require("./routes/static"));

// Rota para a página inicial
app.get("/", baseController.buildHome);

// Rotas de inventário
app.use("/inv", inventoryRoute);

// Middleware para capturar erros 404 (página não encontrada)
app.use(async (req, res, next) => {
  const err = {
    status: 404,
    message: "Sorry, we appear to have lost that page.",
  };
  next(err); // Encaminha o erro para o middleware de erro geral
});


/* ***********************
 * Middleware de Erro Geral
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})





/* ***********************
 * Configuração do Servidor
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
