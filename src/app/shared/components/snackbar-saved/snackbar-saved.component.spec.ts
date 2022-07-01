import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarSavedComponent } from './snackbar-saved.component';

describe('SnackbarSavedComponent', () => {
  let component: SnackbarSavedComponent;
  let fixture: ComponentFixture<SnackbarSavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackbarSavedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
