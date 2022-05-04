import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleUsersComponent } from './handle-users.component';

describe('HandleUsersComponent', () => {
  let component: HandleUsersComponent;
  let fixture: ComponentFixture<HandleUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandleUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandleUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
