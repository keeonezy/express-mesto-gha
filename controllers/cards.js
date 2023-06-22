const User = require("../models/card");
const {
  STATUS_OK,
  STATUS_CREATED,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR } = require("../utils/responseStatus");

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};