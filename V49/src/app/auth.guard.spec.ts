import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: {} },  // Mock Router if needed
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should return true if the user is logged in', () => {
    authService.isLoggedIn.and.returnValue(true);  // Simulate a logged-in state

    // Mock ActivatedRouteSnapshot and RouterStateSnapshot
    const activatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const routerStateSnapshot = {} as RouterStateSnapshot;

    expect(authGuard.canActivate(activatedRouteSnapshot, routerStateSnapshot)).toBeTrue();
  });

  it('should return false if the user is not logged in', () => {
    authService.isLoggedIn.and.returnValue(false);  // Simulate a logged-out state

    // Mock ActivatedRouteSnapshot and RouterStateSnapshot
    const activatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const routerStateSnapshot = {} as RouterStateSnapshot;

    expect(authGuard.canActivate(activatedRouteSnapshot, routerStateSnapshot)).toBeFalse();
  });
});
