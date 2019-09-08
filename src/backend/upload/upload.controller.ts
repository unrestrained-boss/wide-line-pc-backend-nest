import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParamsException } from '../../shared/all-exception.exception';
import * as multer from 'multer';
import * as mkdirp from 'mkdirp';
import { ConfigService } from '../../config/config.service';
import { parse } from 'path';
import * as randomstring from 'randomstring';
import * as fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dir = `./public/uploads/${year}/${month > 9 ? month : '0' + month.toString()}`;
    // TODO: 异常捕捉
    mkdirp.sync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    file = parse(file.originalname);
    cb(null, randomstring.generate() + file.ext);
  },
});

@ApiUseTags('文件上传')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('backend/upload')
export class UploadController {

  @Post('image')
  @UseInterceptors(FileInterceptor('file', {
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    preservePath: true,
  }))
  upload(@UploadedFile() file) {
    if (!file) {
      throw new ParamsException('请上传文件');
    }
    if (!(file.mimetype.toLowerCase().startsWith('image/'))) {
      UploadController.deleteFile(file.path);
      throw new ParamsException('请上传有效的图片文件');
    }
    if (file.size / 1024 / 1024 > 50) {
      UploadController.deleteFile(file.path);
      throw new ParamsException('图片文件不能超过 50M');
    }
    const urlPrefix = ConfigService.urlPrefix;
    const path = file.path.replace(/^\.?\/?public\//, '');
    return {
      path,
      url: urlPrefix + path,
    };
  }

  private static deleteFile(path: string) {
    fs.unlink(path, () => {
      //
    });
  }
}
