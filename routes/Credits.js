const router = require("express").Router(),
  { send, claim, browseclaim, browsesend, findclaimfrom,findclaimto,findsendfrom,findsendto } = require("../controllers/Credits"),
  { protect } = require("../middleware");

router
  .get("/:userId/findclaimfrom", protect, findclaimfrom)
  .get("/findclaimto", protect, findclaimto)
  .get("/:userId/findsendfrom", protect, findsendfrom)
  .get("/findsendto", protect, findsendto)
  .get("/browsesend", protect, browsesend)
  .get("/browseclaim", protect, browseclaim)
  .post("/send", protect, send)
  .post("/claim", protect, claim)

module.exports = router;