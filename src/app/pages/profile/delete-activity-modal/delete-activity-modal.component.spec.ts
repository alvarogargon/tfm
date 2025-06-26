import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteActivityModalComponent } from './delete-activity-modal.component';

describe('DeleteActivityModalComponent', () => {
  let component: DeleteActivityModalComponent;
  let fixture: ComponentFixture<DeleteActivityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteActivityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteActivityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
