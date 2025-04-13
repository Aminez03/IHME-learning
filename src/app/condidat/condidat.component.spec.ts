import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondidatComponent } from './condidat.component';

describe('CondidatComponent', () => {
  let component: CondidatComponent;
  let fixture: ComponentFixture<CondidatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CondidatComponent]
    });
    fixture = TestBed.createComponent(CondidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
