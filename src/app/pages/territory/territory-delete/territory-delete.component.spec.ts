import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryDeleteComponent } from './territory-delete.component';

describe('TerritoryDeleteComponent', () => {
  let component: TerritoryDeleteComponent;
  let fixture: ComponentFixture<TerritoryDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerritoryDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
