import { FileValidator } from '@nestjs/common';

export declare type FileTypeValidatorOptions = {
  fileType: string; // example 'jpg,png'
};

export class FileUploadValidator extends FileValidator<FileTypeValidatorOptions> {
  buildErrorMessage() {
    return `Validation failed (expected type is ${this.validationOptions.fileType})`;
  }
  isValid(file: any) {
    if (!this.validationOptions) {
      return true;
    }

    if (!file.mimetype) {
      return false;
    }

    const [, type] = file.mimetype.split('/');

    return Boolean(this.validationOptions.fileType.split(',').includes(type));
  }
}
