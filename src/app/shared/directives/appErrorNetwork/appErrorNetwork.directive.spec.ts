import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ErrorNetworkDirective } from './appErrorNetwork.directive';

@Component({
  template: `
    <div *appErrorNetwork="hasNetworkError" class="network-error">Erreur réseau détectée</div>
  `,
  standalone: true,
  imports: [ErrorNetworkDirective],
})
class TestComponent {
  hasNetworkError = false;
}

describe('ErrorNetworkDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, ErrorNetworkDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should not render content when condition is false', () => {
    component.hasNetworkError = false;
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('.network-error'));
    expect(div).toBeNull(); // le contenu ne doit pas être rendu
  });

  it('should render content when condition is true', () => {
    component.hasNetworkError = true;
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('.network-error'));
    expect(div).not.toBeNull();
    expect(div.nativeElement.textContent).toContain('Erreur réseau détectée');
  });

  it('should hide content when condition changes from true to false', () => {
    component.hasNetworkError = true;
    fixture.detectChanges();

    component.hasNetworkError = false;
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('.network-error'));
    expect(div).toBeNull();
  });
});
