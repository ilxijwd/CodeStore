import { Injectable } from '@nestjs/common';
import { PDFDocument, PDFString, StandardFonts, rgb } from 'pdf-lib';
import { PDFUnit } from '~/lib/interfaces/pdf';
import * as bufferImageSize from 'buffer-image-size';
import { measureTextWidth } from '~/lib/utils/textWidth';

@Injectable()
export class PdferService {
  async makePDF(units: PDFUnit[]): Promise<Uint8Array> {
    const doc = await PDFDocument.create();
    const timesRomanFont = await doc.embedFont(StandardFonts.TimesRoman);
    const page = doc.addPage();
    const pageSize = page.getSize();

    const fontSize = 8;
    const xOffset = 8;
    let yOffset = pageSize.height - fontSize;

    for (const unit of units) {
      switch (unit.type) {
        case 'PDFText':
          page.drawText(unit.content, {
            x: xOffset,
            y: yOffset,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          yOffset -= fontSize;
          break;
        case 'PDFLink':
          page.drawText(unit.content, {
            x: xOffset,
            y: yOffset,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });

          const linkAnnotation = doc.context.obj({
            Type: 'Annot',
            Subtype: 'Link',
            Rect: [
              xOffset + 1,
              yOffset,
              xOffset + measureTextWidth(unit.content, 8),
              yOffset + fontSize,
            ],
            Border: [0, 0, 2],
            C: [0, 0, 1],
            A: { Type: 'Action', S: 'URI', URI: PDFString.of(unit.link) },
          });

          const linkAnnotationRef = doc.context.register(linkAnnotation);

          page.node.addAnnot(linkAnnotationRef);

          yOffset -= fontSize;
          break;
        case 'PDFImageBase64':
          const img = await doc.embedJpg(unit.content);
          const imgSize = bufferImageSize(Buffer.from(unit.content, 'base64'));

          const ratioWidth = imgSize.width / pageSize.width;
          const ratioHeight = imgSize.height / pageSize.height;
          const ratioAspect =
            ratioWidth > 1 ? ratioWidth : ratioHeight > 1 ? ratioHeight : 1;
          const newWidth = img.width / ratioAspect;
          const newHeight = img.height / ratioAspect;

          page.drawImage(img, {
            x: xOffset,
            y: yOffset - newHeight,
            width: newWidth,
            height: newHeight,
          });

          yOffset -= newHeight;
          break;
        case 'PDFLineBreak':
          yOffset -= fontSize;
          break;
      }
    }

    return doc.save();
  }
}
