import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MangaInfos } from '../../models/manga.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manga-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manga-details-modal.component.html',
})
export class MangaDetailsModalComponent {
  //#region Decorator (notification template parent -> manga.component)

  @Input() manga: MangaInfos | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  //#endregion

  /**
   * onClose
   * --------
   * Ferme le modal de détail d'un manga
   */
  onClose() {
    this.closeModal.emit();
  }
}
