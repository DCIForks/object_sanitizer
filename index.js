/**
 * The problem:
 * 
 * You connect to an API that returns data in JSON format.
 * The data is an array of objects.
 * Unfortunately, not all the objects have exactly the same format.
 * In some objects, certain key-value pairs are missing.
 * 
 * Example: 
 * const api_data = [
 *   { "id": 1,
 *     "always_present":    "dependable",
 *     "sometimes_missing": "unreliable"
 *   },
 *   { "id": 2,
 *     "always_present":    "trustworthy",
 *     "sometimes_present": "uncertain"
 *   }
 * ]
 * 
 * Solution:
 * 
 * Create a sanitize() function that will add any missing keys and
 * give them a default value:
 * 
 * Example:
 *   const sanitized_data = (sanitize(api_data)
 *   console.log("sanitized_data:", sanitized_data)
 *   // [
 *   //   { "id": 1,
 *   //     "always_present":    "dependable",
 *   //     "sometimes_missing": "unreliable"
 *   //     "sometimes_present": ""
 *   //   },
 *   //   { "id": 2,
 *   //     "always_present":    "trustworthy",
 *   //     "sometimes_missing": "",
 *   //     "sometimes_present": "uncertain"
 *   //   }
 *   // ]
 * 
 * !!! IMPORTANT: This has to work for nested objects and arrays !!!
 * See recursive_sanitize() at the end for a comprehensive solution.
 */


// // Here's a simple solution that does not work with nested objects
const api_data = require('./api_data.json')
console.log("api_data", JSON.stringify(api_data, null, '  '));



// Create an object with default values for all required keys
const default_data = {
  "id": 0,
  "always_present":    "",
  "sometimes_missing": "",
  "sometimes_present": { "numbers": [] }
}


function sanitize(data) {
  return data.map( api_object => (
    Object.assign({}, default_data, api_object)
  ))
}


let sanitized = sanitize(api_data)
console.log("sanitized", JSON.stringify(sanitized, null, '  '));



console.log("\n********************************************\n")



// Here's a more complex version
const complex_data = require('./complex.json')
console.log("complex_data", JSON.stringify(complex_data, null, '  '));


const default_object = require('./default.json')
console.log("default_object", JSON.stringify(default_object, null, '  '));


sanitized = recursive_sanitize(complex_data, "default_object")
console.log("sanitized", JSON.stringify(
  sanitized, null, '  ')
);


// RECURSIZE SANITIZE FUNCTION // RECURSIZE SANITIZE FUNCTION //

/**
 * @param  {any}    unreliable
 * @param  {any}    template
 * @param  {object} sanitized (if missing, an object is created)
 * @param  {string} key (if missing, "__sanitize_root__" is used)
 * 
 * @return {any}    sanitized will be the same format as template
 *                  if template is an array or an object. If
 *                  template is any other type then unreliable will
 *                  be returned, unless it is null or undefined.
 */
function recursive_sanitize(unreliable, template, sanitized, key) {
  // Allow this function to be called with just unreliable and
  // template arguments. This simplifies the treatment of arrays.
  if (typeof sanitized !== "object") {
    sanitized = {}
    // Use a key that is unlikely to be anywhere in template
    key = "__sanitize_root__"
  }

  const type = typeof template

  if (Array.isArray(template)) {
    // Ensure that each item in the unreliable array has the
    // same format as the template
    if (template.length) {
      const pattern = template[0]
      const clone = sanitized[key] = []
      if (unreliable.length) {
        unreliable.forEach( unreliableItem => {
          clone.push(
            recursive_sanitize( unreliableItem, pattern )
          )
        })
      } else {
        // Ensure that unreliable contains at least one default entry
        clone.push([...template])
      }
    } else if (!Array.isArray(unreliable)) {
      // Ensure that this property is an array
      sanitized[key] = []
    }

  } else if (type === "object") {
    // Call this function recursively for all properties of the object
    const clone = sanitized[key] = {}

    const keys = Object.keys(template)
    if (keys.length) {
      keys.forEach( key => {
        recursive_sanitize(
          unreliable[key], template[key], clone, key
        )
      })
    }

  } else {
    sanitized[key] = unreliable ?? template
  }

  // For objects in an array, or for the initial call, the output
  // we want will be wrapped in { "__sanitize_root__": <> }
  return sanitized.__sanitize_root__ || sanitized
}
