const express = require("express");
const router = express.Router();
const {
  requestBook,
  getAllRequests,
  getUserRequests,
  approveRequest,
  rejectRequest
} = require("../controllers/requestController");
const { protect, allowRoles } = require("../middleware/auth");

// Student routes
router.post("/request/:bookId", protect, requestBook);
router.get("/my-requests", protect, getUserRequests);

// Admin routes
router.get("/requests", protect, allowRoles("admin"), getAllRequests);
router.post("/approve/:requestId", protect, allowRoles("admin"), approveRequest);
router.post("/reject/:requestId", protect, allowRoles("admin"), rejectRequest);

module.exports = router; 