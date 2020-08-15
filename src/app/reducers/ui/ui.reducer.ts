import * as fromUI from '../ui/actions/ui.actions';

export interface uiState {
  loading: boolean;
}

const initState: uiState = {
  loading: false,
};

export const uiReducer = (
  state: uiState = initState,
  actions: fromUI.acciones
): uiState => {
  switch (actions.type) {
    case fromUI.START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case fromUI.FINISH_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
