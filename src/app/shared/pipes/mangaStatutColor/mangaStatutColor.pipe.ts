import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mangaStatusColor',
  standalone: true,
})
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case 'Publishing':
        return 'bg-green-500/80';
      case 'Finished':
        return 'bg-blue-500/80';
      case 'On Hiatus':
        return 'bg-yellow-500/80';
      case 'Discontinued':
        return 'bg-gray-500/80';
      default:
        return 'bg-gray-300/80';
    }
  }
}
