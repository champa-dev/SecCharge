import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NrelModuleViewStationsComponent } from './nrel-module-view-stations.component';

describe('NrelModuleViewStationsComponent', () => {
  let component: NrelModuleViewStationsComponent;
  let fixture: ComponentFixture<NrelModuleViewStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NrelModuleViewStationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NrelModuleViewStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
