const router = require("express").Router(),
  { browse, find, save, update, destroy } = require("../controllers/Records"),
  { protect } = require("../middleware");

router
  .get("/", browse)
  .get("/:userId/find", find)
  .post("/save", save)
  .put("/:id/update", update)
  .delete("/:id/destroy", destroy);

module.exports = router;
