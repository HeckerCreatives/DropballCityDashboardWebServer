const router = require("express").Router(),
  { send, claim } = require("../controllers/Credits"),
  { protect } = require("../middleware");

router
  .post("/send", send)
  .post("/claim", claim)

module.exports = router;