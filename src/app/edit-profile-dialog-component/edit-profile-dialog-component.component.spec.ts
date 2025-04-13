import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileDialogComponentComponent } from './edit-profile-dialog-component.component';

describe('EditProfileDialogComponentComponent', () => {
  let component: EditProfileDialogComponentComponent;
  let fixture: ComponentFixture<EditProfileDialogComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditProfileDialogComponentComponent]
    });
    fixture = TestBed.createComponent(EditProfileDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
