import { TestBed } from '@angular/core/testing';

import { Flats } from './flats';

describe('Flats', () => {
  let service: Flats;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Flats);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
