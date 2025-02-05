const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildaccountManagement))
router.get("/register", utilities.handleErrors(accountController.buildRegistration))
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
  router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

module.exports = router;