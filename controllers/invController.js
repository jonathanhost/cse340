const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByCarId = async function (req, res, next) {
  
  const car_id = req.params.cardid
  const data = await invModel.getInventoryByCarId(car_id)
  const grid = await utilities.buildCarPage(data)
  let nav = await utilities.getNav()
  res.render("./inventory/carpage", {
    nav,
    grid,
  })
}

invCont.buildinvpage = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

invCont.buildaddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }

  invCont.buildaddVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()

    let classes = await utilities.buildClassificationList()
    res.render("./inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classes,
      errors: null,
    })
  }

  invCont.registerVehicle =  async function(req, res) {
    let nav = await utilities.getNav()
    let classes = await utilities.buildClassificationList()
    const { inv_make,inv_model,inv_year, inv_description, inv_image, inv_thumbnail,inv_price,inv_miles, inv_color,classification_id} = req.body
  
    const regResult = await invModel.addVehicle(
      inv_make,
      inv_model,
      inv_year, 
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${inv_make}.`
      )
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        classes,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        classes,
      })
    }
  }

  invCont.registerClassification =  async function(req, res) {
    console.log('entrou invCont.registerClassification ')
    let nav = await utilities.getNav()
    const { classification_name} = req.body
  
    const regResult = await invModel.addClassification(
      classification_name,
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${classification_name}.`
      )
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("inventory/management", {
        title: "Vehicle Management",
        nav,
      })
    }
  }

module.exports = invCont