const router = require("express").Router(),
{
    convertCurrency,
    browsedc,
    browseic
} = require("../controllers/CurrencyTransfer"),
{ protect } = require("../middleware");

router
.post("/convertcurrency", protect, convertCurrency)
.get("/webtogamedc", browsedc)
.get("/webtogameic", browseic)

module.exports = router;