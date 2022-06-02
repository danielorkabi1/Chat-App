// api404Error.js
const BaseError = require("./baseError");
const   HttpStatusCodes  = require("./httpStatusCodes");
class Api404Error extends BaseError {
  constructor(
    name,
    statusCode = HttpStatusCodes.NOT_FOUND,
    description = "Not found.",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = Api404Error;
