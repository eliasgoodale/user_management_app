import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import store from '../store';

const keyListener = fromEvent(document, 'keydown');


const initialState = {
    keylogger: keyListener.subscribe((e: Event) => store.dispatch({type: 'KEY_DOWN', payload: e})),
    showPasswordModal: false,
    showDeleteConfirmation: false,
}

export default (state: any = initialState, action: any ) => {
    switch(action.type) {
        case 'users/CHANGE_DATA':
            return { ...state, showPasswordModal: false }
        case 'users/TOGGLE_PASSWORD_MODAL':
            return { ...state, showPasswordModal: !state.showPasswordModal }
        case 'users/TOGGLE_DELETE_CONFIRMATION':
            return { ...state, showDeleteConfirmation: !state.showDeleteConfirmation }
        default:
            return state;
    }
}
