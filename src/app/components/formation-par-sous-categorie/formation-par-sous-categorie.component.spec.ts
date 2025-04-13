import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationParSousCategorieComponent } from './formation-par-sous-categorie.component';

describe('FormationParSousCategorieComponent', () => {
  let component: FormationParSousCategorieComponent;
  let fixture: ComponentFixture<FormationParSousCategorieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationParSousCategorieComponent]
    });
    fixture = TestBed.createComponent(FormationParSousCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
