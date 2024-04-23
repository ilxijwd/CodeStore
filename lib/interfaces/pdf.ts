import { PDFUnitType } from '~/lib/types/pdf';

export interface PDFUnit {
  type: PDFUnitType;
  content?: string;
  link?: string;
}
