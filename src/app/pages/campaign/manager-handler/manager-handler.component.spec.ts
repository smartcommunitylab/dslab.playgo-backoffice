import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerHandlerComponent } from './manager-handler.component';

describe('ManagerHandlerComponent', () => {
  let component: ManagerHandlerComponent;
  let fixture: ComponentFixture<ManagerHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerHandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
