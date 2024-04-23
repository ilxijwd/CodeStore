import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import tmdbConfig from '~/lib/config/tmdb';
import serverConfig from '~/lib/config/server';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ load: [tmdbConfig, serverConfig] }),
  ],
  providers: [TmdbService],
  exports: [TmdbService],
})
export class TmdbModule {}
