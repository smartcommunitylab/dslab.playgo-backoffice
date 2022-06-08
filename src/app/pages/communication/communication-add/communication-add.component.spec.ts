import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationAddComponent } from './communication-add.component';

describe('CommunicationAddComponent', () => {
  let component: CommunicationAddComponent;
  let fixture: ComponentFixture<CommunicationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
