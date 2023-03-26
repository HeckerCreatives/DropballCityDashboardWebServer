const router = require("express").Router(),
  { browse, find, update, destroy, referral, getParentReferrer } = require("../controllers/Users"),
  { protect } = require("../middleware");

router
  .get("/", protect, browse)
  .get("/:id/find", find)
  .get("/:id/getparentreferrer", getParentReferrer)
  .get("/:userId/referral", referral)
  .put("/:id/update", protect, update)
  .delete("/:id/destroy", protect, destroy);

module.exports = router;
