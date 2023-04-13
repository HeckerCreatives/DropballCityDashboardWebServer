const router = require("express").Router(),
{
    convertCurrency
} = require("../controllers/CurrencyTransfer"),
{ protect } = require("../middleware");

router
.post("/convertcurrency", protect, convertCurrency)

module.exports = router;