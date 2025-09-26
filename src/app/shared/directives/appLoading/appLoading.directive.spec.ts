import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoadingDirective } from './appLoading.directive';

@Component({
  template: " <div *appLoading='isLoading' class='loading-content'>Chargement...</div> ",
  standalone: true,
  imports: [LoadingDirective],
})
class TestComponent {
  isLoading = false;
}

describe('LoadingDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, LoadingDirective], // <-- attention ici
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should not render content when condition is false', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('.loading-content'));
    expect(div).toBeNull();
  });

  it('should render content when condition is true', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('.loading-content'));
    expect(div).not.toBeNull();
    expect(div.nativeElement.textContent).toContain('Chargement...');
  });

  it('should hide content when condition changes from true to false', () => {
    component.isLoading = true;
    fixture.detectChanges();

    component.isLoading = false;
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('.loading-content'));
    expect(div).toBeNull();
  });
});
