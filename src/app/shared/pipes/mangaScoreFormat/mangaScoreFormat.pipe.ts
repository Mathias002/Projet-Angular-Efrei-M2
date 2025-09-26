import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mangaScoreFormat',
  standalone: true,
})
export class FormatScorePipe implements PipeTransform {
  transform(score: number): string {
    return score ? score.toFixed(1) : 'N/A';
  }
}
