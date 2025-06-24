import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGoalModalComponent } from './edit-goal-modal.component';

describe('EditGoalModalComponent', () => {
  let component: EditGoalModalComponent;
  let fixture: ComponentFixture<EditGoalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGoalModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGoalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
