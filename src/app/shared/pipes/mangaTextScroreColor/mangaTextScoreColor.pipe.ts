import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mangaTextScoreColor',
  standalone: true,
})
export class ScoreColorPipe implements PipeTransform {
  transform(score: number): string {
    if (score >= 8.5) return 'text-green-400';
    if (score >= 7.0) return 'text-yellow-400';
    if (score >= 5.0) return 'text-orange-400';
    return 'text-red-400';
  }
}
