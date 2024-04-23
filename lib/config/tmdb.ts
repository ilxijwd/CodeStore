import { registerAs } from '@nestjs/config';

export default registerAs('tmdb', () => ({
  api_key: process.env.TMDB_API_KEY,
  base_url: process.env.TMDB_BASE_URL,
  base_image_url: process.env.TMDB_BASE_IMAGE_URL,
}));
