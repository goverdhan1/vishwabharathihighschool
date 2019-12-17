import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeUpdateDialogComponent } from '@app/manage/fee-update-dialog/fee-update-dialog.component';

describe('FeeUpdateDialogComponent', () => {
  let component: FeeUpdateDialogComponent;
  let fixture: ComponentFixture<FeeUpdateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeUpdateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
