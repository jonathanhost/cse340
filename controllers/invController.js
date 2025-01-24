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


module.exports = invCont