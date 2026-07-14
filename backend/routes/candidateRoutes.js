import express from "express";
const router=express.Router();
import {protect,authorize} from "../middlewares/authMiddleware.js"

import {
    createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidateStatus,
  updateCandidate,
  deleteCandidate
} from "../controllers/candidateConroller.js"


router.post('/', protect, authorize('admin', 'hr'), createCandidate);
router.get('/', protect, authorize('admin', 'hr'), getCandidates);
router.get('/:id', protect, authorize('admin', 'hr'), getCandidateById);
router.put('/:id', protect, authorize('admin', 'hr'), updateCandidate);
router.put('/:id/status', protect, authorize('admin', 'hr'), updateCandidateStatus);
router.delete('/:id', protect, authorize('admin'), deleteCandidate);

export default router;