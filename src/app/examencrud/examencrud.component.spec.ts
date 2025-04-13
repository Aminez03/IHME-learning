import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamencrudComponent } from './examencrud.component';

describe('ExamencrudComponent', () => {
  let component: ExamencrudComponent;
  let fixture: ComponentFixture<ExamencrudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamencrudComponent]
    });
    fixture = TestBed.createComponent(ExamencrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
