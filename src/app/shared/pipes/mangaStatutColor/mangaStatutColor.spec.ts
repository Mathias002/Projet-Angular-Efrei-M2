import { StatusColorPipe } from './mangaStatutColor.pipe';

describe('StatusColorPipe', () => {
  let pipe: StatusColorPipe;

  beforeEach(() => {
    pipe = new StatusColorPipe();
  });

  it('should return green for "Publishing"', () => {
    expect(pipe.transform('Publishing')).toBe('bg-green-500/80');
  });

  it('should return blue for "Finished"', () => {
    expect(pipe.transform('Finished')).toBe('bg-blue-500/80');
  });

  it('should return yellow for "On Hiatus"', () => {
    expect(pipe.transform('On Hiatus')).toBe('bg-yellow-500/80');
  });

  it('should return gray for "Discontinued"', () => {
    expect(pipe.transform('Discontinued')).toBe('bg-gray-500/80');
  });

  it('should return default gray for unknown status', () => {
    expect(pipe.transform('InvalidStatus')).toBe('bg-gray-300/80');
  });
});
