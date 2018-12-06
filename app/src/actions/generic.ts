import store from '../store'

/**
 * Implementing 
 */
export interface ICommand {
    execute:(dispatchFn: any) => void;
    unexecute:() => void;
}

abstract class BaseCommand implements ICommand {
    public type: string;
    public payload: any;
    constructor({type, payload}: any) {
        this.type=type;
        this.payload=payload;
    }
    abstract execute(): void;
    abstract unexecute(): void;
}

class ReversableCommand extends BaseCommand implements ICommand {
    public invoker: any;
    public receiver: any;
    
    constructor({type, payload, invoker, receiver}: any) {
        super({ type, payload });
        this.invoker = invoker;
        this.receiver = receiver;
    }
    execute(): void {
        this.invoker({
            type: this.type, 
            payload: this.payload
        })
    }
    unexecute(): void {

    }
}

/**
 * Undo
 * 
 * Implementing undo and redo in this app requires more state. An undo or redo state can be determined by
 * answering the following:
 *  - Is there anything left in the queue to undo or redo?
 *  - What is the current state?
 *  - What are the past and future states in the undo stack?
 * 
 * Reducer Enhancer:
 * 
 *      
 */

 /**
  * Writing a reducer
  */
declare type UndoState = any;

const initialState: UndoState = {
    past: [],
    present: null,
    future: [],
}

// function undoable(state=initialState, action: any ) {
//     const { past, present, future } = state;

//     switch(action.type) {
//         case 'UNDO':
//             const previous = past[past.length - 1];
//             const newPast = past.slice(0, past.length - 1);
//             return {
//                 past: newPast,
//                 present: previous,
//                 future: [present, ...future]
//             };
//         case 'REDO':
//             const next = future[0];
//             const newFuture = future.slice(1);
//             return {
//                 past: [...past, present],
//                 present: next,
//                 future: newFuture
//             };
//         default:
//             return state;
//     }
// }

/**
 * Reducer Enhancers:
 *  A reducer enhancer or higher-order reducer is a function that takes a reducer, and returns a new reducer
 *  that is able to handle new actions or to hold more state, delegating control to the inner reducer for 
 *  the actions it doesnt understand.
 * 
 * @function doNothingWith(reducer) {
 *    return @function (state,action) {
 *      calls the passed reducer
 *      return reducer(state, action)
 *    }  
 * }
 * 
 *  @function combineReducers(reducers) {
 *      return @function(state = {}, action) {
 *          @return Object.keys(reducers).reduce((nextState, key) => {
 *              nextState[key] = reducers[key](state[key], action)
 *              @return nextState
 *          }, {})
 *          })
 *      }
 *  }
 */

// function undoEnhancer(reducer: any){
//     const initialState: UndoState = {
//         past: [],
//         present: reducer(undefined, {}),
//         future: [],
//     }

//     return (state=initialState, action: any) => {
//         const { past, present, future } = state;

//         switch(action.type) {
//             case 'UNDO':
//                 const previous = past[past.length - 1];
//                 const newPast = past.slice(0, past.length - 1);
//                 return {
//                     past: newPast,
//                     present: previous,
//                     future: [present, ...future]
//                 };
//             case 'REDO':
//                 const next = future[0];
//                 const newFuture = future.slice(1);
//                 return {
//                     past: [...past, present],
//                     present: next,
//                     future: newFuture
//                 };
//             default:
//                 // Delegate action handling to the passed reducer
//                 const newPresent = reducer(present, action)
//                 if (present === newPresent) {
//                     return state;
//                 }
//                 return {
//                     past: [...past, present],
//                     present: newPresent,
//                     future: []
//                 }
//         }
//     }
// }

/**
 * The following is an example of how to create an action that displays an error to the user,
 * simply uncomment the dispatch below to fire the action when the application starts.
 */

// export const networkErrorAction = (): any => ({
//     type: 'NETWORK_ERROR',
//     /* When you throw an error, always instantiate a new Error object with `new Error()` */
//     payload: new Promise((resolve, reject) => {
//         axios.get('http//localhost:5000/notAnEndpoint')
//             .then((response: any) => {
//                 resolve(response.json().then((json: any) => (
//                     json
//                 )))
//             })
//             .catch(({ response, request, message }: any) => {
//                 reject(
//                     response ? new Error(`Server responded with status ${response.status}, ${response.statusText}`) :
//                         request ? new Error(`No response from server: request details: ${JSON.stringify(request)}`) :
//                             new Error(`Error in request setup: ${message}`)
//                 )
//             })
//     })
// })

//store.dispatch(networkErrorAction());