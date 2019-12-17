import { TestBed } from '@angular/core/testing';

import { PeriodsService } from '@app/services/periods.service';

describe('PeriodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeriodsService = TestBed.get(PeriodsService);
    expect(service).toBeTruthy();
  });
});
