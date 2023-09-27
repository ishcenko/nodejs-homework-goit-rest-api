const validateBody = require("./contactsValidation.js");
const isValidId = require("./isValidId.js");
const authenticate = require("./authenticate.js");
const upload = require("./upload.js");
module.exports = { validateBody, isValidId, authenticate, upload };
