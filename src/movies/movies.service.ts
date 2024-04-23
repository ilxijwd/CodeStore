import { Injectable } from '@nestjs/common';
import { TmdbService } from '../tmdb/tmdb.service';
import { PDFUnit } from '~/lib/interfaces/pdf';
import { PdferService } from '../pdfer/pdfer.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly tmdbService: TmdbService,
    private readonly pdferService: PdferService,
  ) {}

  async getAll(): Promise<Uint8Array> {
    const movies = await this.tmdbService.fetchAll();

    const units: PDFUnit[] = [];
    for (const movie of movies) {
      units.push({ content: movie.title, link: movie.link, type: 'PDFLink' });
      units.push({ content: movie.release_date, type: 'PDFText' });
      units.push({ content: movie.vote_average.toString(), type: 'PDFText' });
      units.push({ type: 'PDFLineBreak' });
    }

    return await this.pdferService.makePDF(units);
  }

  async get(id: number): Promise<Uint8Array> {
    const movie = await this.tmdbService.fetchById(id);

    const units: PDFUnit[] = [];
    units.push({ content: movie.title, type: 'PDFText' });
    units.push({ content: movie.release_date, type: 'PDFText' });
    units.push({ content: movie.vote_average.toString(), type: 'PDFText' });
    units.push({ content: movie.poster_path, type: 'PDFImageBase64' });

    return await this.pdferService.makePDF(units);
  }
}
