const jwt = require("jsonwebtoken"),
  User = require("../models/Users");

exports.protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    res.status(401).json("Not authorized, no token");
  } else {
    if (token.startsWith("Bearer")) {
      // decode token
      jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRET,
        async (err, response) => {
          if (err && err.name) {
            res.status(401).json({ expired: "Not authorized, token expired" });
          } else {
            req.user = await User.findById(response.id).select("-password");
            if (req.user) {
              next();
            } else if(req.user.deletedAt){
              res
                .status(401)
                .json({ message: "ban" });
            } else {
              res
                .status(401)
                .json({ expired: "Not authorized, invalid token" });
            }
          }
        }
      );
    } else {
      res.status(401).json({ error: "Not authorized, invalid token" });
    }
  }
};

exports.notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(400);
  next(error);
};

exports.errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

exports.gameprotect = (req, res, next) => {
  const token = req.headers.authorization;
 
  if(!token){
    res.status(401).json({message: "Not authorized, fake token"});
  } else {
    if(token.startsWith("Bearer")){
      jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRET,
        async (err, response) => {
          if (err && err.name) {
            res.status(401).json({message: "Not authorized, fake token",});
          } else {
            
            if (response.message === "titimalaki") {
              next();
            } else {
              res.status(401).json({message: "Not authorized, fake token",});
            }
          }
        }
      );
    } else {
      res.status(401).json({message: "Not authorized, fake token"});
    }
  }
}