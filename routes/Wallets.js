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
  .get("/", browse)
  .get("/:userId/referrals", referrals)
  .post("/gctoweb", convertgctoweb)
  .get("/gctowebhistory", gcgametoweb)
  .get("/commissionhistory", commissionhistory)
  .post("/convert", convert)
  .get("/all", everything)
  .get("/:userId/find", find)
  .post("/save", save)
  .post("/losetransfer", loseTransfer)
  .put("/:id/update", update)
  .delete("/:id/destroy", destroy);

module.exports = router;
