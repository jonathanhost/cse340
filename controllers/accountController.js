const utilities = require("../utilities")

const accountModel = require("../models/account-model")

const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")




/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }

  async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }


  async function buildaccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    let link = null;
    let account_type = res.locals.accountData?.account_type || ""; 
    const account_firstname =  res.locals.accountData.account_firstname
    const account_id =  res.locals.accountData.account_id
    console.log(account_type)
    if (account_type === "employee" || account_type === "admin") {
      link  = await utilities.getInvLink()
    }
    console.log(link)
    res.render("account/accountmanagement", {
      title: "Account Management",
      nav,
      link,
      account_firstname,
      account_id,
      errors: null,
    })
 
  }

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


async function logout(req, res) {
  try {
    res.clearCookie("jwt", { path: "/" });
    res.clearCookie("sessionId", { path: "/" })
    req.flash("message notice", "Logout realizado com sucesso")
    let nav = await utilities.getNav()
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } catch (error) {
      res.status(500).json({ message: "Erro ao fazer logout" });
  }
}


async function buildUpdateById(req, res) {
const account__id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const items = await accountModel.getAccountById(account__id)
  res.render("./account/update", {
    title: "Edit Account ",
    nav,
    errors: null,
    account_firstname:items.account_firstname,
    account_lastname:items.account_lastname,
    account_email:items.account_email,
    account_id:account__id,
  })
}


 async function updateAccount(req, res, next) {
 let nav = await utilities.getNav()
 const {
  account_id,
  account_firstname,
  account_lastname,
  account_email,
  
 } = req.body
 const updateResult = await accountModel.updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id,
 )

 if (updateResult) {
   req.flash("notice", `The Account was successfully updated.`)
   res.redirect("/account/")
 } else {
   req.flash("notice", "Sorry, the update failed.")
   res.status(501).render("./account/accountmanagement", {
   title: "Account Management" ,
   nav,
   errors: null,
   account_firstname,
   account_lastname,
   account_email,
   account_id,
   })
 }
}


async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()

 
  const {
    account_firstname,
   account_id,
   account_password,
  } = req.body

  console.log("funciton ",account_id )
  let hashedPassword
  hashedPassword = await bcrypt.hashSync(account_password, 10)
  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword,
  )
 
  if (updateResult) {
    req.flash("notice", `The password was successfully updated.`)
    res.redirect("/account/accountmanagement")
  } else {
    req.flash("notice", "Sorry, the update password failed.")
    res.status(501).render("./account/accountmanagement", {
    title: "Account Management" ,
    nav,
    account_firstname,
    account_id,
    errors: null,
    })
  }
 }


 

  
  module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildaccountManagement, logout,buildUpdateById,updateAccount,updatePassword}