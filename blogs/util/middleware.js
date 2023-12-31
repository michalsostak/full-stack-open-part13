const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')
const { Session, User } = require("../models")

const errorHandler = (error, req, res, next) => {
  console.log("Error message: ", error.message)

  if ((error.name === "SyntaxError")) {
    return res.status(400).send({ error: "Incorrect syntax of the new blog, check the submitted properties" });
  } else if (error.name === "TypeError") {
    return res.status(400).send({ error: error.message });
  } else if (error.name == "SequelizeValidationError") {
    return res.status(400).send({ error: error.message });
  }
  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const sessionExtractor = async (req, res, next) => {
  const authorizationTokenWithoutBearer = req.get('authorization').substring(7)
  const session = await Session.findOne({
    where: {
      token: authorizationTokenWithoutBearer,
    },
  })

  if (!session) {
    return res.status(401).json({ error: "No active sessions found. Please log in again." })
  }

  req.session = session
  next();
};

const userExtractor = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (user.disabled) {
    return res.status(401).json({ error: "Unauthorized, user account has been disabled." }) 
  }
  req.user = user
  next()
}

module.exports = { errorHandler, tokenExtractor, sessionExtractor, userExtractor };
