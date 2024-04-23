export const measureTextWidth = (text: string, fontSize: number) => {
  const averageCharWidth = fontSize * 0.5;
  const textWidth = text.length * averageCharWidth;
  return textWidth;
};
