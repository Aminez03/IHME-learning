import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReponsedialogComponent } from './reponsedialog.component';

describe('ReponsedialogComponent', () => {
  let component: ReponsedialogComponent;
  let fixture: ComponentFixture<ReponsedialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReponsedialogComponent]
    });
    fixture = TestBed.createComponent(ReponsedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
