import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserActions } from '../Store/Actions/user.actions';
import { User } from '../Store/Models/user';
import { BehaviorSubject, Subscription, Observable, Subject } from 'rxjs';
import { IAppState } from '../Store/Reducers/index';
import { CustomHttp } from './customHttp';
import { BASE_URL } from '../Constants/settings';

@Injectable()
export class AuthenticationService {

  private meSub: Subscription;

  private loggedInSubsject: BehaviorSubject<boolean>;
  get isLoggedIn(): boolean {
    return this.loggedInSubsject.getValue();
  }
  get isLoggedIn$() : Observable<boolean> {
    return this.loggedInSubsject.asObservable();
  }


  private authenticationPendingSubject: Subject<boolean>;
  private _isAuthenticationPending: boolean = false;
  get isAuthenticationPending(): boolean {
    return this._isAuthenticationPending;
  }

  get isAuthenticationPending$(): Observable<boolean> {
    return this.authenticationPendingSubject.asObservable();
  }




  constructor(private store: Store<IAppState>, private chttp: CustomHttp) {
    this.loggedInSubsject = new BehaviorSubject<boolean>(false);
    this.authenticationPendingSubject = new Subject<boolean>();

    this.authenticationPendingSubject.subscribe(value => {
      this._isAuthenticationPending = value;
    });

    this.store.select('user').subscribe((user: User) => {
      if (user) {
        this.loggedInSubsject.next(true);
      } else {
        this.loggedInSubsject.next(false);
      }
      this.authenticationPendingSubject.next(false);
    });
  }

  login(username: string, password: string, remember: boolean) {
    let rvalue = remember ? '1' : '0';
    this.authenticationPendingSubject.next(true);

    this.store.dispatch(UserActions.userLogin(username, password, rvalue));
  }

  logout() {
    this.store.dispatch(UserActions.userLogout());
  }

  getMe() {
    this.authenticationPendingSubject.next(true);

    if (this.meSub) {
      this.meSub.unsubscribe();
    }
    this.meSub = this.chttp.get(BASE_URL + '/me')
      .map(res => res.json().user)
      .subscribe(
        user => this.store.dispatch(UserActions.userLoginSuccess(user)),
        err => {
          console.log('assuming fresh login');
          this.store.dispatch(UserActions.userLoginFail());
          this.authenticationPendingSubject.next(false);
        },
        () => {}
      );
  }
}
