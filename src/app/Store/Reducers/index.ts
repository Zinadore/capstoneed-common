import { combineReducers } from '@ngrx/store';
import { compose}  from '@ngrx/core';
import { userReducer } from './userReducer';
import { User } from '../Models';

export interface IAppState {
  user: User
}

export default compose(combineReducers)({
  user: userReducer
})
