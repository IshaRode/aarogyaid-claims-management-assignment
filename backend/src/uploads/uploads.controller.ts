import {
  Controller, Post, UploadedFile, UseInterceptors, UseGuards, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const uploadDir = join(process.cwd(), 'uploads');

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `doc-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const isValid = allowedTypes.test(extname(file.originalname).toLowerCase());
        if (isValid) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF, JPG, JPEG, PNG files are allowed'), false);
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return {
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
