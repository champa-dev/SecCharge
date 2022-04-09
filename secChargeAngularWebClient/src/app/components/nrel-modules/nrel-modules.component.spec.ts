import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NrelModulesComponent } from './nrel-modules.component';

describe('NrelModulesComponent', () => {
  let component: NrelModulesComponent;
  let fixture: ComponentFixture<NrelModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NrelModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NrelModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
