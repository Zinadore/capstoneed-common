import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { CustomHttp } from '../../Services/customHttp';
import { UnitActions } from '../Actions/unit.actions';
import { BASE_URL, THROTTLE_TIME } from '../../Constants/settings';
import { Observable } from 'rxjs';
import { UserActions } from '../Actions/user.actions';
import { ToastConfig, ToastrService } from 'ngx-toastr';

@Injectable()
export class UnitEffects {
  constructor(private actions: Actions, private chttp: CustomHttp, private toastrService: ToastrService, ) {

  }

  @Effect() loadUnits$ = this.actions
    .ofType(UnitActions.LOAD_UNITS)
    // .throttleTime(Math.random() * THROTTLE_TIME + 1)
    .switchMap(action => this.chttp.get(BASE_URL + '/units?includes=assignments&compact=true')
      .map(res => res.json().units)
      .switchMap(units => Observable.of(UnitActions.loadUnitsSuccess(units)))
      .catch(err => Observable.of(UnitActions.loadUnitsFail()))
    );

  @Effect()
  loadUnit = this.actions
    .ofType(UnitActions.LOAD_UNIT)
    // .throttleTime(Math.random() * THROTTLE_TIME + 1)
    .switchMap(action => this.chttp.get(`${BASE_URL}/units/${action.payload}?includes=assignments&compact=true`)
      .map(res => res.json().unit)
      .switchMap(unit => Observable.of(UnitActions.loadUnitSuccess(unit)))
      .catch(err => Observable.of(UnitActions.loadUnitFail()))
    );


  @Effect() autoLoadUnits$ = this.actions
    .ofType(UserActions.USER_LOGIN_SUCCESS)
    .switchMap(action => Observable.of(UnitActions.loadUnits()));

  @Effect()
  createFail = this.actions
    .ofType(UnitActions.CREATE_UNIT_FAIL)
    .map(action => action.payload)
    .map(err => err.errors)
    .do(errors => {
      let config: ToastConfig = {
        enableHtml: true,
        timeOut: 0,
        extendedTimeOut: 0,
        positionClass: 'toast-top-full-width',
        closeButton: true,
        tapToDismiss: true
      };

      let message = `These are the errors i detected:
        <ul>
      `;

      for (var property in errors) {
        if (errors.hasOwnProperty(property)) {
          message += `<li>${property} : ${errors[property]}</li>`
        }
      }

      message += '</ul>';

      this.toastrService.error(message, 'I could not create your assignment', config);
    });
}
