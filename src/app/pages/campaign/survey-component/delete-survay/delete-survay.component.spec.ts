import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSurvayComponent } from './delete-survay.component';

describe('DeleteSurvayComponent', () => {
  let component: DeleteSurvayComponent;
  let fixture: ComponentFixture<DeleteSurvayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSurvayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSurvayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
