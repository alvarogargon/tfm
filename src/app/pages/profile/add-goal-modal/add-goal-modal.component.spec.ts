import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGoalModalComponent } from './add-goal-modal.component';

describe('AddGoalModalComponent', () => {
  let component: AddGoalModalComponent;
  let fixture: ComponentFixture<AddGoalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGoalModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGoalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
