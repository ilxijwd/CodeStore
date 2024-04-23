import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { TmdbModule } from './tmdb/tmdb.module';
import { PdferModule } from './pdfer/pdfer.module';

@Module({
  imports: [MoviesModule, TmdbModule, PdferModule],
})
export class AppModule {}
