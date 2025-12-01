import { Router } from 'express';
import multer from 'multer';
import * as documentController from '../controllers/documentController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/application/:applicationId', documentController.listDocuments);
router.get('/:documentId', documentController.getDocument);
router.post('/:documentId/accept', documentController.acceptDocument);
router.post('/:documentId/reject', documentController.rejectDocument);
router.delete('/:documentId', documentController.deleteDocument);
router.get('/:documentId/download-url', documentController.getDownloadUrl);
router.get('/:documentId/versions', documentController.getVersionHistory);

export default router;
