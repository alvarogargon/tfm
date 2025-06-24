import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGuideUserModalComponent } from './add-guide-user-modal.component';

describe('AddGuideUserModalComponent', () => {
  let component: AddGuideUserModalComponent;
  let fixture: ComponentFixture<AddGuideUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGuideUserModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGuideUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
