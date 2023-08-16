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
    playerwinhistory,
    deducthistory,
    totaldeductperday,
    totaldeductpermonth,
    totaldeductperyear
  } = require("../controllers/Wallets"),
  { protect, gameprotect } = require("../middleware");

router
  .get("/", protect,browse)
  .post("/deductionhistory", protect, deducthistory)
  .post("/totaldeductionperday", protect, totaldeductperday)
  .post("/totaldeductionpermonth", protect, totaldeductpermonth)
  .post("/totaldeductionperyear", protect, totaldeductperyear)
  .get("/:userId/referrals", referrals)
  .post("/gctoweb", gameprotect, convertgctoweb)
  .get("/gctowebhistory",protect, gcgametoweb)
  .get("/commissionhistory", commissionhistory)
  .get("/palyerwinhistory", playerwinhistory)
  .post("/convert", convert)
  .get("/all", everything)
  .get("/:userId/find", find)
  .post("/save", save)
  .post("/losetransfer", gameprotect, loseTransfer)
  .put("/:id/update",protect, update)
  .delete("/:id/destroy",protect, destroy);

module.exports = router;
