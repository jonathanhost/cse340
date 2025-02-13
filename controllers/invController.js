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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
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

  /* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const items = await invModel.getInventoryByCarId(inv_id)
  const itemData = items[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  console.log(itemData.inv_description)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


invCont.updateInventory = async function (req, res, next) {
 let nav = await utilities.getNav()
 const {
   inv_id,
   inv_make,
   inv_model,
   inv_description,
   inv_image,
   inv_thumbnail,
   inv_price,
   inv_year,
   inv_miles,
   inv_color,
   classification_id,
 } = req.body
 const updateResult = await invModel.updateInventory(
   inv_make,
   inv_model,
   inv_description,
   inv_image,
   inv_thumbnail,
   inv_price,
   inv_year,
   inv_miles,
   inv_color,
   classification_id,
   inv_id
 )

 if (updateResult) {
   const itemName = updateResult.inv_make + " " + updateResult.inv_model
   req.flash("notice", `The ${itemName} was successfully updated.`)
   res.redirect("/inv/")
 } else {
   const classificationSelect = await utilities.buildClassificationList(classification_id)
   const itemName = `${inv_make} ${inv_model}`
   req.flash("notice", "Sorry, the insert failed.")
   res.status(501).render("inventory/edit-inventory", {
   title: "Edit " + itemName,
   nav,
   classificationSelect: classificationSelect,
   errors: null,
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
 }
}



invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const items = await invModel.getInventoryByCarId(inv_id)
  const itemData = items[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}


invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {inv_id,} = req.body
  const deleteResult = await invModel.deleteInventory(inv_id)
 
  if (deleteResult) {
    req.flash("notice", `The item was successfully removed.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", `The item delete failed.`)
    res.redirect("/inv/delete/inv_id")
    }
  }


  invCont.accountType = async function (req, res, next) {
    let account_type = res.locals.accountData?.account_type || ""; 

    if (account_type === "employee" || account_type === "admin") {
        next();
    } else {
        req.flash(
            "notice",
            `This must NOT be used when delivering the classification or detail views as they are meant for site visitors who may not be logged in.`
        );

        let nav = await utilities.getNav();
        res.render("./account/login", {
            title: "Login",
            nav,
            errors: null,
        });
    }
};


 
  
 

module.exports = invCont