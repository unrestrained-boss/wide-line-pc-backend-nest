import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  static urlPrefix = '';
  private readonly envConfig: { [key: string]: any };
  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    ConfigService.urlPrefix = this.getUrlPrefix();
  }

  getString(key: string): string {
    return this.envConfig[key];
  }
  getNumber(key: string): number {
    return +this.envConfig[key];
  }
  getUrlPrefix(): string {
    const host = this.getString('SERVER_HOST');
    const port = this.getNumber('SERVER_PORT');
    return `http://${host}:${port}/static/`;
  }
}
