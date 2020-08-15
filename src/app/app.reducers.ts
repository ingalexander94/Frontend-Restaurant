import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from './reducers/auth/auth.reducer';
import * as fromUI from './reducers/ui/ui.reducer';
import * as fromChat from './reducers/chat/chatReducer';

export interface AppState {
    auth: fromAuth.authState,
    ui: fromUI.uiState,
    chat: fromChat.chatState
}

export const combineReducer: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    ui: fromUI.uiReducer,
    chat: fromChat.chatReducer
}

