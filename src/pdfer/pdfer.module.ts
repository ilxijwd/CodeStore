import { Module } from '@nestjs/common';
import { PdferService } from './pdfer.service';

@Module({
  providers: [PdferService],
  exports: [PdferService],
})
export class PdferModule {}
