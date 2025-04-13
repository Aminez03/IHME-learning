import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCourComponent } from './modal-cour.component';

describe('ModalCourComponent', () => {
  let component: ModalCourComponent;
  let fixture: ComponentFixture<ModalCourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCourComponent]
    });
    fixture = TestBed.createComponent(ModalCourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
