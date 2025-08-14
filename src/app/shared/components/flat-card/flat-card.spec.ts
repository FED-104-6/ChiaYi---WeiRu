import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatCard } from './flat-card';

describe('FlatCard', () => {
  let component: FlatCard;
  let fixture: ComponentFixture<FlatCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlatCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
