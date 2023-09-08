const errorHandler = (error, req, res, next) => {
  console.log("Error message: ", error.message)

  if ((error.name === "SyntaxError")) {
    return res.status(400).send({ error: "Incorrect syntax of the new blog, check the submitted properties" });
  } else if (error.name === "TypeError") {
    return res.status(400).send({ error: "Incorrect type, perhaps trying to update a nonexisting id?" });
  } else if (error.name == "SequelizeValidationError") {
    return res.status(400).send({ error: "Validation isEmail on username failed" });
  }
  next(error);
};

module.exports = { errorHandler };
