const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const {
    getAllItems,
    getItemById,
    getMyReports,
    createItem,
    updateItem,
    deleteItem
} = require("../controllers/itemController");

router.get("/", getAllItems);

router.get("/my-reports", authenticate, getMyReports);

router.get("/:id", getItemById);

router.post("/", authenticate, upload.single("image"), createItem);

router.put("/:id", authenticate, upload.single("image"), updateItem);

router.delete("/:id", authenticate, deleteItem);

module.exports = router;
