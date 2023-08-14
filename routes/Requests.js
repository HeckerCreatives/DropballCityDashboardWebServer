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
  .get("/",protect, browse)
  .get("/to",protect, to)
  .get("/:userId/find",protect, find)
  .post("/save",protect, save)
  .put("/:id/update",protect,update)
  .delete("/:id/destroy",protect, destroy);

module.exports = router;
