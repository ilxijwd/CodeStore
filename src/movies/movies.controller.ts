import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { MoviesService } from './movies.service';
import type { Response } from 'express';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getAll(
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const filename = `movies-${Date.now()}.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    });
    const pdf = await this.moviesService.getAll();
    return new StreamableFile(pdf);
  }

  @Get(':id')
  async get(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const filename = `movies-${Date.now()}.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    });
    const pdf = await this.moviesService.get(id);
    return new StreamableFile(pdf);
  }
}
