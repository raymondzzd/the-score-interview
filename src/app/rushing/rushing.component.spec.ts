import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RushingComponent } from './rushing.component';

describe('RushingComponent', () => {
  let component: RushingComponent;
  let fixture: ComponentFixture<RushingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RushingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RushingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
