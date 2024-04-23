import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import tmdbConfig from '~/lib/config/tmdb';
import serverConfig from '~/lib/config/server';
import { Movie } from '~/lib/interfaces/movie';
import { arrayBufferToBase64 } from '~/lib/utils/img';

@Injectable()
export class TmdbService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(tmdbConfig.KEY)
    private readonly tmdb: ConfigType<typeof tmdbConfig>,
    @Inject(serverConfig.KEY)
    private readonly server: ConfigType<typeof serverConfig>,
  ) {}

  async fetchAll(): Promise<Movie[]> {
    const url = `${this.tmdb.base_url}/movie/popular`;
    const params = new URLSearchParams();
    params.append('api_key', this.tmdb.api_key);
    const { data } = await firstValueFrom(
      this.httpService
        .get<{ results: Movie[] }>(url, {
          params,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    return data.results.map((movie) => ({
      ...movie,
      link: `${this.server.base_url}/movies/${movie.id}`,
    }));
  }

  async fetchById(id: number): Promise<Movie> {
    const url = `${this.tmdb.base_url}/movie/${id}`;
    const params = new URLSearchParams();
    params.append('api_key', this.tmdb.api_key);
    const { data } = await firstValueFrom(
      this.httpService
        .get<Movie>(url, {
          params,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    const image = await this.fetchImage(data.poster_path);
    return { ...data, poster_path: image };
  }

  async fetchImage(imageUrl: string): Promise<string> {
    const url = `${this.tmdb.base_image_url}${imageUrl}`;
    const { data } = await firstValueFrom(
      this.httpService
        .get<ArrayBuffer>(url, {
          responseType: 'arraybuffer',
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    return arrayBufferToBase64(data);
  }
}
