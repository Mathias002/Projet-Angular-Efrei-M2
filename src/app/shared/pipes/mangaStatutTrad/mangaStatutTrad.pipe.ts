import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mangaStatutTrad',
  standalone: true,
})
export class StatusTextPipe implements PipeTransform {
  transform(status: string): string {
    const statusMap: Record<string, string> = {
      Publishing: 'En cours',
      Finished: 'Terminé',
      'On Hiatus': 'En pause',
      Discontinued: 'Arrêté',
      Upcoming: 'À venir',
    };
    return statusMap[status] || status;
  }
}
