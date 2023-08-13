const router = require("express").Router(),
  { browse, find, update, destroy, referral, getParentReferrer, migratetolowercase, emailcheck } = require("../controllers/Users"),
  { protect } = require("../middleware");

router
  .get("/", browse)
  .post("/emailchecker", emailcheck)
  .get("/:id/find", find)
  .get("/:id/getparentreferrer", getParentReferrer)
  .get("/:userId/referral", referral)
  .put("/:id/update", update)
  .put("/lowercase", migratetolowercase)
  .delete("/:id/destroy", destroy);

module.exports = router;
