import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryAddFormComponent } from './territory-add-form.component';

describe('TerritoryAddFormComponent', () => {
  let component: TerritoryAddFormComponent;
  let fixture: ComponentFixture<TerritoryAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerritoryAddFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerritoryAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
