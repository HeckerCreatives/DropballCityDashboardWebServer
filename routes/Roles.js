const router = require("express").Router(),
  { browse, find, update, migrate } = require("../controllers/Roles");

router
  .get("/", browse)
  .get("/:name/find", find)
  .put("/:id/update", update)
  .post("/migrate", migrate);

module.exports = router;
