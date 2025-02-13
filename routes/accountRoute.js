const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

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

  router.get("/update/:account_id", utilities.checkLogin,accountController.buildUpdateById);

  router.post(
    "/update",
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
  )

  router.post(
    "/update-password",
    regValidate.passwordUpdate(),
    regValidate.checkUpdatePassword,
    utilities.handleErrors(accountController.updatePassword)

  )

  router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildaccountManagement))
  router.get("/logout", utilities.handleErrors(accountController.logout))
module.exports = router;