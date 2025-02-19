import { TestBed } from '@angular/core/testing';

import { HashUrlRedirectionService } from './hash-url-redirection.service';

describe('HashUrlRedirectionService', () => {
  let service: HashUrlRedirectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HashUrlRedirectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
