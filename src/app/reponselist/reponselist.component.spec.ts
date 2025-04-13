import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReponselistComponent } from './reponselist.component';

describe('ReponselistComponent', () => {
  let component: ReponselistComponent;
  let fixture: ComponentFixture<ReponselistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReponselistComponent]
    });
    fixture = TestBed.createComponent(ReponselistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
