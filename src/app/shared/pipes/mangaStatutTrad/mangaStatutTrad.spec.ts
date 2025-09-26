import { StatusTextPipe } from './mangaStatutTrad.pipe';

describe('StatusTextPipe', () => {
  let pipe: StatusTextPipe;

  beforeEach(() => {
    pipe = new StatusTextPipe();
  });

  it('should translate "Publishing" to "En cours"', () => {
    expect(pipe.transform('Publishing')).toBe('En cours');
  });

  it('should translate "Finished" to "Terminé"', () => {
    expect(pipe.transform('Finished')).toBe('Terminé');
  });

  it('should translate "On Hiatus" to "En pause"', () => {
    expect(pipe.transform('On Hiatus')).toBe('En pause');
  });

  it('should return original status if not in map', () => {
    expect(pipe.transform('UnknownStatus')).toBe('UnknownStatus');
  });
});
