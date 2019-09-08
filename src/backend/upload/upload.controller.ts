import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParamsException } from '../../shared/all-exception.exception';
import * as multer from 'multer';
import * as mkdirp from 'mkdirp';
import { ConfigService } from '../../config/config.service';
import { parse } from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dir = `./public/uploads/${year}/${month}`;
    // TODO: 异常捕捉
    mkdirp.sync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    file = parse(file.originalname);
    cb(null, Date.now().toString() + file.ext);
  },
});

@ApiUseTags('文件上传')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('backend/upload')
export class UploadController {

  constructor(private configService: ConfigService) {
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file', {
    storage,
    preservePath: true,
  }))
  upload(@UploadedFile() file) {
    if (!file) {
      throw new ParamsException('请上传文件');
    }
    if (!(file.mimetype.toLowerCase().startsWith('image/'))) {
      throw new ParamsException('请上传有效的图片文件');
    }
    if (file.size / 1024 / 1024 > 50) {
      throw new ParamsException('图片文件不能超过 50M');
    }
    const host = this.configService.getString('SERVER_HOST');
    const port = this.configService.getNumber('SERVER_PORT');
    const path = file.path.replace(/^\.?\/?public\//, '');
    return {
      path,
      url: `http://${host}:${port}/static/${path}`,
    };
  }
}
