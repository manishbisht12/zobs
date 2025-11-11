import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const uploadsDir = path.join(rootDir, 'uploads', 'messages');

const ensureUploadDir = () => {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to ensure upload directory exists', error);
  }
};

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const fileFilter = (req, file, cb) => {
  if (!file) {
    cb(null, false);
    return;
  }

  const allowed = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'));
  }
};

export const uploadAttachment = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export const singleAttachment = uploadAttachment.single('attachment');

