const router = require("express").Router(),
  {
    loseTransfer,
    browse,
    find,
    save,
    update,
    destroy,
    referrals,
    convert,
    everything,
    convertgctoweb,
  } = require("../controllers/Wallets"),
  { protect } = require("../middleware");

router
  .get("/", protect, browse)
  .get("/:userId/referrals", referrals)
  .post("/gctoweb", convertgctoweb)
  .post("/convert", convert)
  .get("/all", everything)
  .get("/:userId/find", find)
  .post("/save", save)
  .post("/losetransfer", protect, loseTransfer)
  .put("/:id/update", protect, update)
  .delete("/:id/destroy", protect, destroy);

module.exports = router;
