import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoutineModalComponent } from './edit-routine-modal.component';

describe('EditRoutineModalComponent', () => {
  let component: EditRoutineModalComponent;
  let fixture: ComponentFixture<EditRoutineModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRoutineModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRoutineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
