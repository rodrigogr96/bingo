import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBingoComponent } from './home-bingo.component';

describe('HomeBingoComponent', () => {
  let component: HomeBingoComponent;
  let fixture: ComponentFixture<HomeBingoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeBingoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
