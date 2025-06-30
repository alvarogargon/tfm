import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRoutinesModalComponent } from './shared-routines-modal.component';

describe('SharedRoutinesModalComponentTsComponent', () => {
  let component: SharedRoutinesModalComponent;
  let fixture: ComponentFixture<SharedRoutinesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedRoutinesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedRoutinesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
