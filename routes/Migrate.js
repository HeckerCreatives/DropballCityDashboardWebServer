const router = require("express").Router(),
  {
    migrateuser
  } = require("../controllers/Migrate"),
  { protect, gameprotect } = require("../middleware");

router
  .post("/usermigrate", migrateuser);