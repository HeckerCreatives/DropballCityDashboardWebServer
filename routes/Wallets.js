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
    gcgametoweb,
    commissionhistory,
  } = require("../controllers/Wallets"),
  { protect } = require("../middleware");

router
  .get("/", protect, browse)
  .get("/:userId/referrals", referrals)
  .post("/gctoweb", protect, convertgctoweb)
  .get("/gctowebhistory", protect, gcgametoweb)
  .get("/commissionhistory", protect, commissionhistory)
  .post("/convert", convert)
  .get("/all", everything)
  .get("/:userId/find", find)
  .post("/save", save)
  .post("/losetransfer", loseTransfer)
  .put("/:id/update", protect, update)
  .delete("/:id/destroy", protect, destroy);

module.exports = router;
