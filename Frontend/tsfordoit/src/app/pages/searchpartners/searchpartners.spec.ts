import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Searchpartners } from './searchpartners';

describe('Searchpartners', () => {
  let component: Searchpartners;
  let fixture: ComponentFixture<Searchpartners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Searchpartners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Searchpartners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
