import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLikedComponent } from './users-liked.component';

describe('UsersLikedComponent', () => {
  let component: UsersLikedComponent;
  let fixture: ComponentFixture<UsersLikedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersLikedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersLikedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
