# Application Structure

## Root Reducer

This application was created using React, and Redux in combination with Redux-Observable, an RxJs
based middleware. 

In Redux, to change the application state an action is dispatched to the reducers. An action contains a piece of the new state sent to provide additional, overwrite existing, or clear the state of a node in the state-tree. This is performed by calling the dispatch method provided by the  Redux store on an action creator from app/actions called with its required arguments.

When an action is dispatched to the root reducer, it hits all of the reducers in which there is a case statement for the action's type. For instance, when
dispatching a TogglePasswordModal action the ui reducer would receive that action at its case for 'users/TOGGLE_PASSWORD_MODAL' which is the action's type. At that point, a new state is returned, with the the showPasswordModal toggled. 

The root reducer in this UI has 7 sections:

### Collection 
Maintains the entire collection of user data. Any action with a payload that contains a Promised wrapped response from the server deposits its payload data here after it enters fulfillment status.

>Rules for this reducer:
 
* It may only receive data  or be modified via response from the server


### Editor

Maintains the current view data in the grid and the modes in which it can be edited. Kendo examples have you process the data (filter/sort) on every render cycle. This is incredibly inefficient for large volumes of data. In this application, data processing happens whenever collection data changes in a way that would effect the presence or order of items in the editor, or when the filter/sort options are changed. You can think of the data in this portion of the state as ephemeral, volatile, and subject to modification by the user.

Rules for this reducer:
* It may only receive data processed from the collection, or entered by the user. 

* It must maintain the index of the selected user on a selection-by-selection basis.


### Error

Supervises the global error state of the application and controls an alert dialog to display errors to the suer

* Currently, any error should be immediately displayed

### Filter

Contains a composite filter descriptor. 

* Currently filters all columns simultaneously

### Sort
Contains the sort descriptor. 

* Currently sorts by one column at a time.

### UI

Contains all non-error UI elements. (Delete/Password Modals currently)

### Validation

Holds the userInEdit object and a backup of that user from the collection. From the changes to the userInEdit a compare() operation is performed on the backup and edit data, and a patch document is generated from the result. 

* To change the validation procedure attach a new function to the validator field in the initialState tree.

* To change the patch function attach the new one to the generatePatch field initialState to make that function available to components. Edit the 'users/CHANGE_DATA' case's return
value in the validation reducer to return the functions
result in the patch field

## Root Epic

An epic is a function that intakes an observable stream of actions and returns a new action. Async with Redux either requires manually creating an arduous amount of boilerplate actions for initial dispatch, promise resolution, and rejection, or a middleware solution that can dispatch actions based on the resolve/reject values of Promises(thunk/redux promise). It is poor practice to dispatch an action in a reducer as this leads to complicated unreadable callback hell. Epics allow you to use RxJs to simplify the development process and increase code maintainability. 

The root Epic receives all actions that occur in the application after they have hit the reducers and reacts to that action by dispatching a new one. For example, whenever a new REJECTED action is dispatched the Epic reacts by opening the error dialog with that error. Rather than having to include repetitive case statements across multiple reducers for all combinations of responses types, entities, and contexts you can use an epic to generically handle all of these cases with a pure function that returns a guaranteed, typesafe value you need without changing all of your reducers and complicating your codebase. Later we may choose to not display certain errors to the user, or change the message displayed based on a response status. We can inject that dependency into the epic rather than creating dependent cases for different app behaviors in all of our reducers. Since we can transform the action before dispatching it, we can maintain generic types of actions 
corresponding to common ui behavior( OpenModal, SubmitData, CloseModal, etc ) and choose which reducer to dispatch to (error.ErrorModal, ui.PasswordModal, PasswordForm etc)

### reProcessData

Filters any action that changes the collection, cancels a change to the current editor data, or changes the filter/sort of the table. It responds by delivering processed data to the editor using the kendo-data-query functions orderBy and filterBy. You can change the way data is processed by editing the processData function in utils.


### handleValidationStateReset

Writing a case for every type of action that resets the validation mode to its initial state is unmaintainable. This epic filters any action that needs to reset the validation state and dispatches a resetValidationState action. 

### handleSoftDelete

Dispatches the delete confirmation toggle whenever the action to soft delete a user is dispatched.

### loadEditUserBackup

Whenever a new user is selected in the editor (except in create mode) this epic dispatches an action containing an unedited backup copy of the user in edit to the validation reducer. This, combined with the userInEdit generates the patch document while editing the user.



