import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignAddFormComponent } from './campaign-add-form.component';

describe('CampaignAddFormComponent', () => {
  let component: CampaignAddFormComponent;
  let fixture: ComponentFixture<CampaignAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignAddFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
