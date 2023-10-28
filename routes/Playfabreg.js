const router = require("express").Router(),
  { register } = require("../controllers/Playfabreg"),
  { protect } = require("../middleware");

router
    .post("/ingamereg", register)
module.exports = router;
