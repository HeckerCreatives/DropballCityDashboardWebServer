const router = require("express").Router(),
  { send, claim, browseclaim, browsesend, findclaimfrom,findclaimto,findsendfrom,findsendto } = require("../controllers/Credits"),
  { protect } = require("../middleware");

router
  .get("/:userId/findclaimfrom",findclaimfrom)
  .get("/findclaimto",findclaimto)
  .get("/:userId/findsendfrom",findsendfrom)
  .get("/findsendto",findsendto)
  .get("/browsesend",browsesend)
  .get("/browseclaim",browseclaim)
  .post("/send",send)
  .post("/claim",claim)

module.exports = router;