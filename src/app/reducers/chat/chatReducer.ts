import { userRedux, Convesation } from '../../interface/interfaces';
import * as fromChat from '../chat/actions/chat.actions';

export interface chatState {
  receptor: userRedux;
  conversation: Convesation[];
}

const initState: chatState = {
  receptor: null,
  conversation: [],
};

export const chatReducer = (
  state: chatState = initState,
  actions: fromChat.acciones
): chatState => {
  switch (actions.type) {
    case fromChat.SET_RECEPTOR:
      return {
        ...state,
        receptor: { ...actions.payload }
      };

    case fromChat.UNSET_RECEPTOR:
      return { ... initState };

    case fromChat.SET_CONVERSATION:
      return {
        ...state,
        conversation: [...state.conversation, {...actions.payload}]
      };
    
    case fromChat.LOAD_CONVERSATION:
      return {
          ...state,
          conversation: [...actions.payload]
      }

    case fromChat.UNSET_CONVERSATION:
      return {
        ...state,
        conversation: []
      }

    default:
      return state;
  }
};
