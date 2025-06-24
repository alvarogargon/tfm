import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActivityModalComponent } from './add-activity-modal.component';

describe('AddActivityModalComponent', () => {
  let component: AddActivityModalComponent;
  let fixture: ComponentFixture<AddActivityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddActivityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddActivityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
