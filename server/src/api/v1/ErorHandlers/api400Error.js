// api400Error.js
const BaseError = require("./baseError");
const  HttpStatusCodes=require('./httpStatusCodes')
class Api400Error extends BaseError {
  constructor(
    name,
    statusCode = HttpStatusCodes.BAD_REQUEST,
    description = "Not found.",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = Api400Error;
