const router = require("express").Router(),
{
    convertCurrency,
    browsedc,
    browseic
} = require("../controllers/CurrencyTransfer"),
{ protect } = require("../middleware");

router
.post("/convertcurrency",protect, convertCurrency)
.get("/webtogamedc", protect, browsedc)
.get("/webtogameic", protect, browseic)

module.exports = router;