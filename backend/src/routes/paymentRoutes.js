const express = require("express");
const { processMockPayment } = require("../services/paymentService");
const router = express.Router();

router.post("/mock-payment", processMockPayment);

module.exports = router;
