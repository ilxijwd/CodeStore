import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  base_url: process.env.BASE_URL,
}));
