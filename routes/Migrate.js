const router = require("express").Router(),
  {
    migrateuser,
    commionoff
  } = require("../controllers/Migrate"),
  { protect, gameprotect } = require("../middleware");

router
  .post("/usermigrate", migrateuser)
  .post("/commionoff", commionoff)
module.exports = router;