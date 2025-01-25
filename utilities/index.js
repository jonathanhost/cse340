const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data && data.length  > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* **************************************
* Build the Car page view HTML
* ************************************ */
Util.buildCarPage = async function(data) {
  let grid = ""; 
  try {
      if (Array.isArray(data) && data.length > 0) {
          grid = '<div id="car-display">';

          data.forEach(vehicle => {
              grid += '<div class="car-image">';
              grid += '<a href="../../inv/detail/' + vehicle.inv_id 
                  + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
                  + ' details"><img src="' + vehicle.inv_image 
                  + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
                  + ' on CSE Motors" /></a>';
              grid += '<hr />';
              grid += '</div>';
              grid += '<div>';
              grid += '<h1>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>';
              grid += '<div class="details">';
              grid += '<span><strong>Price: $</strong>' 
                  + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
              grid += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>';
              grid += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>';
              grid += '<p><strong>Miles: </strong>' + vehicle.inv_miles + '</p>';
              grid += '<p><strong>Color: </strong>' + vehicle.inv_color + '</p>';
              grid += '</div>';
              grid += '</div>';
          });

          grid += '</div>';
      } else {
          grid = '<p class="notice">ERROR 500.</p>';
      }
  } catch (err) {
      console.error("Erro to build the car:", err.message);
      grid = '<p class="error">Internal Error.</p>';
  }

  return grid;
};


  
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res , next)).catch(next)

module.exports = Util
