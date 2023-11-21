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
    totaldeductperyear,
    totalcommissionperday,
    totalcommissionpermonth,
    totalcommissionperyear,
    totalcommissionhistory,
    totaldeducthistory,
    convertpottogame,
    plusfive,
    findcommionoff,
    updatecommionoff
  } = require("../controllers/Wallets"),
  { protect, gameprotect } = require("../middleware");

router
  .get("/", protect,browse)
  .get("/findcommionoff", protect, findcommionoff)
  .post("/updatecommionoff", protect, updatecommionoff)
  .post("/plusfive", protect, plusfive)
  .post("/deductionhistory", protect, deducthistory)
  .post("/totaldeductionhistory", protect, totaldeducthistory)
  .post("/totaldeductionperday", protect, totaldeductperday)
  .post("/totaldeductionpermonth", protect, totaldeductpermonth)
  .post("/totaldeductionperyear", protect, totaldeductperyear)
  .post("/totalcommissionperday", protect, totalcommissionperday)
  .post("/totalcommissionpermonth", protect, totalcommissionpermonth)
  .post("/totalcommissionperyear", protect, totalcommissionperyear)
  .get("/:userId/referrals", referrals)
  .post("/gctoweb", gameprotect, convertgctoweb)
  .post("/pottogame", gameprotect, convertpottogame)
  .get("/gctowebhistory",protect, gcgametoweb)
  .post("/commissionhistory",protect, commissionhistory)
  .post("/totalcommissionhistory",protect, totalcommissionhistory)
  .get("/palyerwinhistory",protect, playerwinhistory)
  .post("/convert", convert)
  .get("/all", everything)
  .get("/:userId/find", find)
  .post("/save", save)
  .post("/losetransfer", gameprotect, loseTransfer)
  .put("/:id/update",protect, update)
  .delete("/:id/destroy",protect, destroy);

module.exports = router;
