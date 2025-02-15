const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require('../utilities/classification-validation')
const regValidatevehicle = require('../utilities/vehicle-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.accountType, invController.buildByClassificationId);
router.get("/detail/:cardid",invController.accountType, invController.buildByCarId);
router.get("/", invController.accountType,invController.buildinvpage);
router.get("/add-classification", invController.accountType, utilities.handleErrors(invController.buildaddClassification));
router.post(
    "/add-classification",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.registerClassification)
  )

  router.get("/add-vehicle", invController.accountType,utilities.handleErrors(invController.buildaddVehicle));
router.post(
    "/add-vehicle",
    regValidatevehicle.registationRules(),
    regValidatevehicle.checkRegData,
    utilities.handleErrors(invController.registerVehicle)
  )

  router.get("/getInventory/:classification_id", invController.accountType, utilities.handleErrors(invController.getInventoryJSON))

  router.get("/edit/:inv_id", invController.accountType, utilities.handleErrors(invController.editInventoryView));

  router.get("/edit-classification", invController.accountType,utilities.handleErrors(invController.buildEditClassification));
  router.post(
    "/edit-classification/",
    regValidate.registationRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateClassification)
  )


  router.post(
    "/update/",
    regValidatevehicle.registationRules(),
    regValidatevehicle.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
  )

  router.get("/delete/:inv_id", invController.accountType,utilities.handleErrors(invController.deleteInventoryView));
  router.post(
    "/delete/",
   utilities.handleErrors(invController.deleteInventory)
  )

module.exports = router;