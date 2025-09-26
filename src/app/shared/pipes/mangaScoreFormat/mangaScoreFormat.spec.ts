import { FormatScorePipe } from './mangaScoreFormat.pipe';

describe('FormatScorePipe', () => {
  let pipe: FormatScorePipe;

  beforeEach(() => {
    pipe = new FormatScorePipe();
  });

  it('should format score with one decimal', () => {
    expect(pipe.transform(8.234)).toBe('8.2');
  });

  it('should return "N/A" when score is 0', () => {
    expect(pipe.transform(0)).toBe('N/A');
  });

  it('should return "N/A" when score is undefined', () => {
    expect(pipe.transform(undefined as unknown as number)).toBe('N/A');
  });
});
