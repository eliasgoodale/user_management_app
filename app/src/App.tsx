import React, { Component } from 'react';
import { connect } from 'react-redux'
import '@progress/kendo-theme-default/dist/all.css'
import * as UserActionGroup from './actions'
import { User, GridState} from './types'


import {
  Grid,
  GridColumn as Column,
  GridSortChangeEvent,
  GridRowClickEvent,
  GridItemChangeEvent, 
  GridFilterChangeEvent,
  GridToolbar } from '@progress/kendo-react-grid'

import { Operation } from 'fast-json-patch';

import { 
  CompositeFilterDescriptor, 
  SortDescriptor, 
  orderBy, 
  filterBy } from '@progress/kendo-data-query';

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { 
  AlertDialog,
  CheckboxCell,
  PasswordModal,
  ToolbarButtons,
  CommandCell
  } from './components'

interface UserGridProps {
  data: User[];
  sort: SortDescriptor[];
  filter: CompositeFilterDescriptor;
  patch: Operation [],
  inEdit: string | null;
  editIndex: number;
  inCreateMode: boolean;
  onSortChange(e: GridSortChangeEvent): void;
  onRowClick(e: GridRowClickEvent): void;
  onItemChange(e: GridItemChangeEvent): void;
  onFilterChange(e: GridFilterChangeEvent): void;
  getAllUsers(): void;
  reactivateUser(): void;
  togglePasswordModal(): void;
  syncData(data: User[]): void;
}

/**
 * Comment out the the columns you dont want, add ones you do.
 * The rules are only that the title is a string, and the filter 
 * corresponds to the type of the field. The field name, and array key
 * are passed as the property key.
 */

const header = {
  //id: { title: 'ID', filter: 'text' },
  username: { title: 'Username', filter: 'text' },
  firstName: { title: 'First Name', filter: 'text' },
  lastName: { title: 'Last Name', filter: 'text'},

  isEntryAdmin: { 
    title: 'Entry Admin',
    filter: 'boolean',
    cell: CheckboxCell,
  },
  isListAdmin: { 
    title: 'List Admin',
    filter: 'boolean',
    cell: CheckboxCell,
  },
  isLocationManager: { 
    title: 'Location Manager',
    filter: 'boolean',
    cell: CheckboxCell,
  },
  isOperatorAdmin: { 
    title: 'Operator Admin',
    filter: 'boolean',
    cell:CheckboxCell,
  },
  isUserAdmin: { 
    title: 'User Admin',
    filter: 'boolean',
    cell: CheckboxCell,
  },
  isActive: { 
    title: 'Active',
    filter: 'boolean',
    cell: CheckboxCell,
  },
}

/**
 * Controls the css properties of the container components
 */
const styles = {
  paper: {
    padding: 8 * 3,
    elevation: 10,
    maxHeight: 750,
  },
  grid: {
    maxHeight: 750,
    container: {
      flex: 2,
    }
  }
}

class UserGrid extends Component<any, {}> {

  private _columns: JSX.Element[];



  public constructor (props: any) {
    super(props);
    this._columns = this.createColumns(header)
  }

  createColumns(header: any): JSX.Element[] {
    return Object.keys(header).map((key) => {
        const { title, filter } = header[key]
        const hasCheckboxCell = filter === 'boolean'
      /**
       * Boolean cells have an applicable override attached in the header.
       * You can change whether this component is displayed as default, or with
       * the cell override, by commenting/uncommenting the cell property respectively. 
       * CheckboxCell is not finished, but it works for getting the feel 
       * of how it would look. If you like it, I can get that 100%.
       */
      return hasCheckboxCell ? 
        <Column 
          key={key}
          field={key}
          title={title}
          filter={filter}
          resizable
          editor="boolean"
          editable={key !== "isActive"}
          // cell={(props) => <CheckboxCell {...props}/>}
          /> :
        <Column 
          key={key} 
          field={key} 
          title={title}
          resizable
          filter={filter}
          />  
    })
  }
  
  render() {
    const {
      /* State from mapStateToProps */
      data,
      editIndex,
      filter,
      inEdit,
      patch,
      sort,
  

      /* Action Creators from mapDispatchToProps */
      getAllUsers,
      onSortChange,
      onRowClick,
      onItemChange,
      onFilterChange,
      reactivateUser,
      togglePasswordModal, } = this.props

      /**
       * This function adds the inEdit:boolean property to the user 
       * whose id matches the id of inEdit and sorts/filters the data  when
       * props.sort:SortDescriptor and props.filter:CompositeFilterDescriptor
       * have at least one element.
       */
      const tableData = data.map( (u: User) => {return {...u, inEdit: u.id === inEdit}})
      // console.table(tableData);
      // console.log(`editIndex: ${editIndex}, currentIndex: ${currentIndex} tableData len: ${tableData.length}`)
    return (
      <React.Fragment>
        <AlertDialog/>
        <PasswordModal/>
        <Paper style={styles.paper}>
        <Grid style={styles.grid}
          data={tableData}
          sort={sort}
          filter={filter}
          editField="inEdit"
          onSortChange={onSortChange}
          onRowClick={patch.length > 0 ? (e)=>{console.log(e)} : onRowClick}
          onItemChange={onItemChange}
          onFilterChange={onFilterChange}
          filterable
          resizable
          sortable
          reorderable>
        <GridToolbar>
          <ToolbarButtons/>
        </GridToolbar>
          {[<Column key="command-cell"
              filterable={false}
              sortable={false}
              cell={CommandCell(togglePasswordModal, reactivateUser, inEdit)}/>, this._columns ]}
        </Grid>
        </Paper>
        <Button onClick={getAllUsers}>
          Get Data 
        </Button>
      </React.Fragment>
    );
  }
}

/**
 * The mapStateToProps method receives the value of store.getState() as its
 * argument. The key corresponds to the name of the props key in the component.
 * For example, data: state.editor.data, provides the value of state.editor.data,
 * to props.data in the component (props.data = state.editor.data). This is where
 * you can pass what state the component receives from the Provider as props.
 */

function mapStateToProps(state: any) {
  return {
    data: state.editor.present.data,
    inEdit: state.validation.inEdit,
    inCreateMode: state.editor.present.inCreateMode,
    editIndex: state.editor.present.editIndex,
    sort: state.sort,
    filter: state.filter,
    patch: state.validation.patch
  }
}

/**
 * The mapDispatchToProps function provides the action creators available to
 * the component as props. A method name in the UserGrid component 
 * matching one of the keys below is an alias for firing that action creator
 * and dispatching it to the reducers.
 */

function mapDispatchToProps(dispatch: any) {
  return {
    onSortChange: (e: GridSortChangeEvent) => {
      dispatch(UserActionGroup.changeSort(e.sort))
    },
    onRowClick: (e: GridRowClickEvent) => {
      dispatch(UserActionGroup.selectRow(e.dataItem))
    },
    onItemChange: (e: GridItemChangeEvent) => {
      dispatch(UserActionGroup.changeUserData(e.dataItem.id, e.field, e.value))
    },
    onFilterChange: (e: GridFilterChangeEvent) => {
      dispatch(UserActionGroup.changeFilter(e.filter))
    },
    reactivateUser: (id: string) => {
      dispatch(UserActionGroup.reactivateUser(id))
    },
    togglePasswordModal: () => {
      dispatch(UserActionGroup.togglePasswordModal());
    },
    syncData: (data: User[]) => {
      dispatch(UserActionGroup.syncData(data));
    },
    getAllUsers: () => dispatch(UserActionGroup.getAllUsers()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserGrid);
