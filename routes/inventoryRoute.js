const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require('../utilities/classification-validation')
const regValidatevehicle = require('../utilities/vehicle-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:cardid", invController.buildByCarId);
router.get("/", invController.buildinvpage);
router.get("/add-classification", utilities.handleErrors(invController.buildaddClassification));
router.post(
    "/add-classification",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.registerClassification)
  )

  router.get("/add-vehicle", utilities.handleErrors(invController.buildaddVehicle));
router.post(
    "/add-vehicle",
    regValidatevehicle.registationRules(),
    regValidatevehicle.checkRegData,
    utilities.handleErrors(invController.registerVehicle)
  )

module.exports = router;