import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoutineModalComponent } from './add-routine-modal.component';

describe('AddRoutineModalComponent', () => {
  let component: AddRoutineModalComponent;
  let fixture: ComponentFixture<AddRoutineModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRoutineModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRoutineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
