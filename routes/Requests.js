const router = require("express").Router(),
  {
    browse,
    find,
    save,
    update,
    destroy,
    to,
  } = require("../controllers/Requests"),
  { protect } = require("../middleware");

router
  .get("/", browse)
  .get("/to", to)
  .get("/:userId/find", find)
  .post("/save", save)
  .put("/:id/update", update)
  .delete("/:id/destroy", destroy);

module.exports = router;
