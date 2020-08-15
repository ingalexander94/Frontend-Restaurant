import {userRedux} from '../../interface/interfaces';
import * as fromActions from './actions/auth.actions';

export interface authState {
    user: userRedux;
}

const initState: authState = {
    user: null
}

export const authReducer = (state= initState, actions: fromActions.acciones ): authState => {
    switch (actions.type) {
        case fromActions.SET_USER:
            return {
                ...state,
                user: {...actions.user}
            };
    
            case fromActions.UNSET_USER:
                return {
                    ...state,
                    user: null
                };            

        default:
            return state;
    }
}

