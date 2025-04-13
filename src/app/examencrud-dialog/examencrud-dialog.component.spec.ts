import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamencrudDialogComponent } from './examencrud-dialog.component';

describe('ExamencrudDialogComponent', () => {
  let component: ExamencrudDialogComponent;
  let fixture: ComponentFixture<ExamencrudDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamencrudDialogComponent]
    });
    fixture = TestBed.createComponent(ExamencrudDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
