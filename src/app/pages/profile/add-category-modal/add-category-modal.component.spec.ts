import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryModalComponent } from './add-category-modal.component';

describe('AddCategoryModalComponent', () => {
  let component: AddCategoryModalComponent;
  let fixture: ComponentFixture<AddCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCategoryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
