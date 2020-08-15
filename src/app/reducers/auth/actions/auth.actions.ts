import { Action } from '@ngrx/store';
import {userRedux} from '../../../interface/interfaces';

export const SET_USER = "[AUTH] Set User";
export const UNSET_USER = "[AUTH] Unset User";

export class SetUserAction implements Action {
    readonly type = SET_USER;
    constructor(public user: userRedux){}
}

export class UnsetUserAction implements Action {
    readonly type = UNSET_USER;
}

export type acciones = SetUserAction   |
                       UnsetUserAction;