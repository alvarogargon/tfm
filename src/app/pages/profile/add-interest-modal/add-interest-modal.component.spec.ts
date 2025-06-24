import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInterestModalComponent } from './add-interest-modal.component';

describe('AddInterestModalComponent', () => {
  let component: AddInterestModalComponent;
  let fixture: ComponentFixture<AddInterestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInterestModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInterestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
