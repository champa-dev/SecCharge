import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMapsComponent } from './display-maps.component';

describe('DisplayMapsComponent', () => {
  let component: DisplayMapsComponent;
  let fixture: ComponentFixture<DisplayMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayMapsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
