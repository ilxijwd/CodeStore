import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TmdbModule } from '../tmdb/tmdb.module';
import { PdferModule } from '../pdfer/pdfer.module';

@Module({
  imports: [TmdbModule, PdferModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
