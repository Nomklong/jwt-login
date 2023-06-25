import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class StorageProvider {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * path default 'images'
   * @param file
   * @returns
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const { buffer } = file;

      const compressImage = await sharp(buffer)
        .webp({ quality: 70 })
        .toBuffer();

      const formData = new FormData();
      formData.append('image', compressImage.toString('base64'));

      const response = this.httpService.post(
        `https://api.imgbb.com/1/upload?expiration=600&key=${this.config.get<string>(
          'imageApiKey',
        )}`,
        formData,
      );

      const { data: imageData } = await lastValueFrom(response);

      return imageData.data.display_url;
    } catch (err) {
      throw new Error('Can not upload file.');
    }
  }
}
