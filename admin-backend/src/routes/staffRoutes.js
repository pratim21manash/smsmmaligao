import express from 'express'
import {
  createStaff,
  getStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff
} from '../controllers/staffController.js'
import { protect } from '../middleware/auth.js'
import { uploadImage, compressSingleImage, verifyImageUploads } from '../middleware/upload.js'

const router = express.Router()

router.post('/', protect, uploadImage.single('image'), verifyImageUploads, compressSingleImage, createStaff)
router.get('/', getStaff)
router.get('/all', protect, getAllStaff)
router.get('/:id', getStaffById)
router.put('/:id', protect, uploadImage.single('image'), verifyImageUploads, compressSingleImage, updateStaff)
router.delete('/:id', protect, deleteStaff)

export default router
