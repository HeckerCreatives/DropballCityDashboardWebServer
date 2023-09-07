const router = require("express").Router(),
  { browse, find, update, destroy, referral, getParentReferrer, migratetolowercase, emailcheck, goldbanusers, goldbanagent ,silverbanusers } = require("../controllers/Users"),
  { protect } = require("../middleware");

router
  .get("/", protect,browse)
  .post("/emailchecker", emailcheck)
  .post("/goldbanusers", protect ,goldbanusers)
  .post("/goldbanagent", protect ,goldbanagent)
  .post("/silverbanusers", protect ,silverbanusers)
  .get("/:id/find", find)
  .get("/:id/getparentreferrer", getParentReferrer)
  .get("/:userId/referral", referral)
  .put("/:id/update",protect, update)
  .put("/lowercase", migratetolowercase)
  .delete("/:id/destroy", protect,destroy);

module.exports = router;
