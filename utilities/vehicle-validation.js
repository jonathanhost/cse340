const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a Make with more than 3 characteres"), // on error this message is sent.
  
      // lastname is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a Model with  more than 3 characteres."), // on error this message is sent.


         // lastname is required and must be string
      body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isFloat({ min: 0 }) 
      .withMessage("Please provide a valid Price."),
     
      // password is required and must be strong password
      body("inv_year")
      .notEmpty()
      .isInt({ min: 1886, max: new Date().getFullYear() }) 
      .withMessage("Please provide a valid Year."),

      body("inv_miles")
        .notEmpty()
        .withMessage("Please provide a valid Miles.")
        .isNumeric()
        .withMessage("Please provide a numeric value."),

    body("inv_description")
      .notEmpty()
      .withMessage("Please provide a valid Description."),

      body("inv_image")
      .notEmpty()
      .withMessage("Please provide a valid Image."),

      body("inv_image")
      .notEmpty()
      .withMessage("Please provide a valid Thumbnail."),

      body("inv_color")
      .notEmpty()
      .withMessage("Please provide a valid Color."),
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const {    inv_make,
        inv_model,
        inv_year, 
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classes = await utilities.buildClassificationList()
      res.render("inventory/add-vehicle", {
        errors: errors.array(),
        title: "Add Vehicle",
        nav,
        classes,
        inv_make,
        inv_model,
        inv_year, 
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id 
      })
      return
    }
    next()
  }


  validate.checkUpdateData = async (req, res, next) => {
    const {  inv_id,  inv_make,
        inv_model,
        inv_year, 
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classes = await utilities.buildClassificationList()
      res.render("inventory/edit-inventory", {
        errors: errors.array(),
        title: "Update Iventory",
        nav,
        classes,
        inv_id,
        inv_make,
        inv_model,
        inv_year, 
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id 
      })
      return
    }
    next()
  }
  
  module.exports = validate
  