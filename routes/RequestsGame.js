const router = require("express").Router(),
  { transfer } = require("../controllers/RequestsGame"),
  { protect } = require("../middleware");

router
  .post("/transfer", transfer);

module.exports = router;
