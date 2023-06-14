const router = require("express").Router(),
  {
    login,
    save,
    update,
    changePassword,
    file,
    injectPassword,
  } = require("../controllers/Auth"),
  { protect } = require("../middleware");

router
  .get("/login", login)
  .post("/save", save)
  .put("/:id/updates", update)
  .put("/changePassword", protect, changePassword)
  .put("/:id/update", injectPassword)
  .post("/file", protect, file);

module.exports = router;
