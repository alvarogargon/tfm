import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutineDetailsComponent } from './routine-details.component';

describe('RoutineDetailsComponent', () => {
  let component: RoutineDetailsComponent;
  let fixture: ComponentFixture<RoutineDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutineDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
