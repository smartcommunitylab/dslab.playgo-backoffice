import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationTrackComponent } from './validation-track.component';

describe('ValidationTrackComponent', () => {
  let component: ValidationTrackComponent;
  let fixture: ComponentFixture<ValidationTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationTrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
