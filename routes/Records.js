const router = require("express").Router(),
  { browse, find, save, update, destroy } = require("../controllers/Records"),
  { protect } = require("../middleware");

router
  .get("/", protect, browse)
  .get("/:userId/find", protect, find)
  .post("/save", protect, save)
  .put("/:id/update", protect, update)
  .delete("/:id/destroy", protect, destroy);

module.exports = router;
