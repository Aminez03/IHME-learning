import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSessionComponent } from './detail-session.component';

describe('DetailSessionComponent', () => {
  let component: DetailSessionComponent;
  let fixture: ComponentFixture<DetailSessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailSessionComponent]
    });
    fixture = TestBed.createComponent(DetailSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
