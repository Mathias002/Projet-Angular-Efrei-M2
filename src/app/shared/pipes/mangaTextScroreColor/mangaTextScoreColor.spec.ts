import { ScoreColorPipe } from './mangaTextScoreColor.pipe';

describe('ScoreColorPipe', () => {
  let pipe: ScoreColorPipe;

  beforeEach(() => {
    pipe = new ScoreColorPipe();
  });

  it('should return green when score >= 8.5', () => {
    expect(pipe.transform(9)).toBe('text-green-400');
  });

  it('should return yellow when score >= 7.0 and < 8.5', () => {
    expect(pipe.transform(7.5)).toBe('text-yellow-400');
  });

  it('should return orange when score >= 5.0 and < 7.0', () => {
    expect(pipe.transform(6)).toBe('text-orange-400');
  });

  it('should return red when score < 5.0', () => {
    expect(pipe.transform(3)).toBe('text-red-400');
  });
});
