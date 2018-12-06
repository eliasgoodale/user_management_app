import { combineReducers } from 'redux';
import undoable from 'redux-undo';



import collection from './collection';
import editor from './editor';
import error from './error';
import filter from './filter';
import sort from './sort';
import ui from './ui';
import validation from './validation';


export default combineReducers({
    collection,
    editor: undoable(editor),
    error,
    filter,
    sort,
    ui,
    validation
})