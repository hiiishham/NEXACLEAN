const express = require("express");
const router = express.Router();
const { bookService, subscribe } = require("../controllers/bookingController");

router.post("/book-service", bookService);
router.post("/subscribe", subscribe);

module.exports = router;
