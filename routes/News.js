const router = require("express").Router(),
  { browse, find, save, update, destroy } = require("../controllers/News"),
  { protect } = require("../middleware");

router
  .get("/", browse)
  .get("/:status/find", find)
  .post("/save", save)
  .put("/:id/update", update)
  .delete("/:id/destroy", destroy);

module.exports = router;
