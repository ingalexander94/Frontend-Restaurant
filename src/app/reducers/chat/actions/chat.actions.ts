import { Action } from '@ngrx/store';
import { userRedux, Convesation } from '../../../interface/interfaces';

export const SET_RECEPTOR = "[CHAT] Set Receptor";
export const UNSET_RECEPTOR = "[CHAT] Unset Receptor";
export const LOAD_CONVERSATION = "[CHAT] Load Conversation";
export const SET_CONVERSATION = "[CHAT] Set Conversation";
export const UNSET_CONVERSATION = "[CHAT] Unset Conversation";

export class SetReceptorClass implements Action {
    readonly type = SET_RECEPTOR;
    constructor(public payload: userRedux){};
}

export class UnsetReceptorClass implements Action {
    readonly type = UNSET_RECEPTOR;
}

export class SetConversationClass implements Action {
    readonly type = SET_CONVERSATION;
    constructor(public payload: Convesation){};
}

export class LoadConversationClass implements Action {
    readonly type = LOAD_CONVERSATION;
    constructor(public payload: Convesation[]){};
}

export class UnsetConversationClass implements Action {
    readonly type = UNSET_CONVERSATION;
}



export type acciones = SetReceptorClass      |
                       UnsetReceptorClass    | 
                       SetConversationClass  |
                       LoadConversationClass |
                       UnsetConversationClass;