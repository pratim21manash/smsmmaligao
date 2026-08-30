import express from 'express'
import {
  createCircular,
  getCirculars,
  getAllCirculars,
  getCircularById,
  updateCircular,
  deleteCircular
} from '../controllers/circularController.js'
import { protect } from '../middleware/auth.js'
import { uploadCircular, verifyCircularPdf } from '../middleware/upload.js'

const router = express.Router()

router.post('/', protect, uploadCircular.single('pdf'), verifyCircularPdf, createCircular)
router.get('/', getCirculars)
router.get('/all', protect, getAllCirculars)
router.get('/:id', getCircularById)
router.put('/:id', protect, uploadCircular.single('pdf'), verifyCircularPdf, updateCircular)
router.delete('/:id', protect, deleteCircular)

export default router
