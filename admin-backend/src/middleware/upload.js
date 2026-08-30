// import multer from "multer";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import fs from "fs-extra";
// import sharp from "sharp";

// // Ensure upload directories exist
// const ensureDir = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// // Image storage
// const imageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/images";
//     ensureDir(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const filename = `${uuidv4()}${ext}`;
//     cb(null, filename);
//   },
// });

// // Circular PDF storage
// const circularStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/circulars";
//     ensureDir(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const filename = `${uuidv4()}${ext}`;
//     cb(null, filename);
//   },
// });

// // Download file storage
// const downloadStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/downloads";
//     ensureDir(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const filename = `${uuidv4()}${ext}`;
//     cb(null, filename);
//   },
// });

// // Image filter
// const imageFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
//   const extname = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase(),
//   );
//   const mimetype = allowedTypes.test(file.mimetype);
//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"));
//   }
// };

// // PDF filter
// const pdfFilter = (req, file, cb) => {
//   if (file.mimetype === "application/pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF files are allowed"));
//   }
// };

// // Document filter (for downloads)
// const documentFilter = (req, file, cb) => {
//   const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar/;
//   const extname = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase(),
//   );
//   if (extname) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only document files are allowed"));
//   }
// };

// export const uploadImage = multer({
//   storage: imageStorage,
//   fileFilter: imageFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

// export const uploadCircular = multer({
//   storage: circularStorage,
//   fileFilter: pdfFilter,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
// });

// export const uploadDownload = multer({
//   storage: downloadStorage,
//   fileFilter: documentFilter,
//   limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
// });

// export const uploadMultipleImages = multer({
//   storage: imageStorage,
//   fileFilter: imageFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
// }).array("images", 4);

// /**
//  * Compress a single uploaded image in place using sharp.
//  * Skips SVGs (vector, not rasterized) since sharp treats them differently.
//  * Resizes to a max width and re-encodes at the given quality to reduce size.
//  */
// export const compressImage = async (
//   filePath,
//   { quality = 80, maxWidth = 1200 } = {},
// ) => {
//   try {
//     const ext = path.extname(filePath).toLowerCase();
//     if (ext === ".svg" || ext === ".gif") return; // skip vector/animated formats

//     const buffer = await sharp(filePath)
//       .resize({ width: maxWidth, withoutEnlargement: true })
//       .jpeg({ quality, mozjpeg: true })
//       .toBuffer()
//       .catch(async () => {
//         // Fall back to format-preserving compression if jpeg conversion fails
//         return sharp(filePath)
//           .resize({ width: maxWidth, withoutEnlargement: true })
//           .toBuffer();
//       });

//     await fs.writeFile(filePath, buffer);
//   } catch (error) {
//     console.error("Image compression skipped due to error:", error.message);
//   }
// };

// /**
//  * Express middleware wrapper: compresses req.file (single upload) after multer has saved it.
//  */
// export const compressSingleImage = async (req, res, next) => {
//   try {
//     if (req.file) {
//       await compressImage(req.file.path);
//     }
//     next();
//   } catch (error) {
//     next();
//   }
// };

// /**
//  * Express middleware wrapper: compresses all files in req.files (multiple upload) after multer has saved them.
//  */
// export const compressMultipleImages = async (req, res, next) => {
//   try {
//     if (req.files && req.files.length > 0) {
//       await Promise.all(req.files.map((file) => compressImage(file.path)));
//     }
//     next();
//   } catch (error) {
//     next();
//   }
// };

// export const deleteFile = async (filePath) => {
//   try {
//     if (fs.existsSync(filePath)) {
//       await fs.unlink(filePath);
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.error("Error deleting file:", error);
//     return false;
//   }
// };

import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";
import sharp from "sharp";

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Image storage
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/images";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const extensions = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
    };
    const filename = `${uuidv4()}${extensions[file.mimetype] || ".bin"}`;
    cb(null, filename);
  },
});

// Circular PDF storage
const circularStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/circulars";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const filename = `${uuidv4()}.pdf`;
    cb(null, filename);
  },
});

// Download file storage
const downloadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/downloads";
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// Image filter
const imageFilter = (req, file, cb) => {
  const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ]);
  if (allowedTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

// PDF filter
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" && path.extname(file.originalname).toLowerCase() === ".pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

// Document filter (for downloads)
const documentFilter = (req, file, cb) => {
  const allowedExtensions = new Set([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".zip", ".rar"]);
  if (allowedExtensions.has(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Only document files are allowed"));
  }
};

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadCircular = multer({
  storage: circularStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const uploadDownload = multer({
  storage: downloadStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

export const uploadMultipleImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
}).array("images", 4);

const removeFiles = async (files) => {
  await Promise.all(files.map((file) => fs.remove(file.path).catch(() => {})));
};

// Multer's MIME type is supplied by the client, so verify the bytes after the
// file is written and before it is processed or made available publicly.
export const verifyImageUploads = async (req, res, next) => {
  const files = req.files || (req.file ? [req.file] : []);
  try {
    for (const file of files) {
      const metadata = await sharp(file.path).metadata();
      if (!new Set(["jpeg", "png", "gif", "webp"]).has(metadata.format)) {
        throw new Error("Unsupported image format");
      }
    }
    next();
  } catch (error) {
    await removeFiles(files);
    res.status(400).json({ success: false, message: "Invalid image upload" });
  }
};

export const verifyCircularPdf = async (req, res, next) => {
  if (!req.file) return next();
  try {
    const header = (await fs.readFile(req.file.path)).subarray(0, 5).toString("ascii");
    if (header !== "%PDF-") throw new Error("Invalid PDF");
    next();
  } catch (error) {
    await removeFiles([req.file]);
    res.status(400).json({ success: false, message: "Invalid PDF upload" });
  }
};

/**
 * Compress a single uploaded image in place using sharp.
 * Skips SVGs (vector, not rasterized) since sharp treats them differently.
 * Resizes to a max width and re-encodes at the given quality to reduce size.
 */
export const compressImage = async (
  filePath,
  { quality = 80, maxWidth = 1200 } = {},
) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".svg" || ext === ".gif") return; // skip vector/animated formats

    const buffer = await sharp(filePath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer()
      .catch(async () => {
        // Fall back to format-preserving compression if jpeg conversion fails
        return sharp(filePath)
          .resize({ width: maxWidth, withoutEnlargement: true })
          .toBuffer();
      });

    await fs.writeFile(filePath, buffer);
  } catch (error) {
    console.error("Image compression skipped due to error:", error.message);
  }
};

/**
 * Express middleware wrapper: compresses req.file (single upload) after multer has saved it.
 */
export const compressSingleImage = async (req, res, next) => {
  try {
    if (req.file) {
      await compressImage(req.file.path);
    }
    next();
  } catch (error) {
    next();
  }
};

/**
 * Express middleware wrapper: compresses all files in req.files (multiple upload) after multer has saved them.
 */
export const compressMultipleImages = async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      await Promise.all(req.files.map((file) => compressImage(file.path)));
    }
    next();
  } catch (error) {
    next();
  }
};

export const deleteFile = async (filePath) => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      await fs.unlink(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};
