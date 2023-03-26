const router = require("express").Router(),
  { transfer } = require("../controllers/RequestsGame"),
  { protect } = require("../middleware");

router
  .post("/transfer", protect, transfer);

module.exports = router;
