import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifSessionComponent } from './certif-session.component';

describe('CertifSessionComponent', () => {
  let component: CertifSessionComponent;
  let fixture: ComponentFixture<CertifSessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertifSessionComponent]
    });
    fixture = TestBed.createComponent(CertifSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
