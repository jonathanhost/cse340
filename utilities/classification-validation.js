const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide classification name."), // on error this message is sent.
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: errors.array(),
        classification_name
      })
      return
    }
    next()
  }
  
  module.exports = validate
  