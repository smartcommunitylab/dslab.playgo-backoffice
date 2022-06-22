import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSurvayComponent } from './assign-survay.component';

describe('AssignSurvayComponent', () => {
  let component: AssignSurvayComponent;
  let fixture: ComponentFixture<AssignSurvayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSurvayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSurvayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
