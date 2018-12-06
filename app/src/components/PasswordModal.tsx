import * as React from 'react';
import Button from '@material-ui/core/Button';
import * as ActionGroup from '../actions';
import { connect } from 'react-redux';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Input } from '@progress/kendo-react-inputs';
import { User }from '../types'
import { compare } from 'fast-json-patch';

function formInvalid(password: string, confirm :string): boolean {
	const mismatch: boolean = password !== confirm;
	const invalidLength: boolean = password.length <= 6 || password.length >= 18;
	/** Use Joi Later for regex */
	return mismatch || invalidLength;
}

const PasswordForm = (props: any) => {
	const {
		inEdit,
		newVal,
		onPasswordSubmit } = props;
	
	const [password, setPassword] = React.useState(newVal);
	const [confirm, setConfirm] = React.useState("");
	return (
		<React.Fragment>
		<form >
			<div style={{ marginBottom: '1rem' }}>
			<label>
				New Password<br />
				<Input
                    name="password"
					type="password"
					style={{ width: '100%' }}
					value={password}
					onChange={(e: any) => setPassword(e.value)}
                    label="Password"
                    required={true}
                    minLength={6}
                    maxLength={18}/>
			</label>
			<br />
			<label>
				Confirm Password <br />
				<Input
                    name="password"
					type="password"
					style={{ width: '100%' }}
					onChange={(e: any) => setConfirm(e.value)}
					value={confirm}
                    label="Password"
                    required={true}
                    minLength={6}
                    maxLength={18}/>	
			</label>
			</div>
		</form>
		<DialogActionsBar>
		<Button
		onClick={() => onPasswordSubmit({ id: inEdit, value: confirm })} 
			
			// userId: inEdit,
			// patch: compare(	{ password: origVal },
			// 				{ password: confirm })
			// })}

		disabled={formInvalid(password, confirm)}>
			Submit
		</Button>
		</DialogActionsBar>
		</React.Fragment>
	)
}


class PasswordModal extends React.Component <any, {}>{
	public render() {
		const {
			changePassword,
			togglePasswordModal,
			showPasswordModal,
			inEdit } = this.props

	return (
		<React.Fragment>
		{ showPasswordModal && 
			<Dialog 
				title="Change Password"
				onClose={togglePasswordModal}>
			<PasswordForm
				inEdit={inEdit}
				onPasswordSubmit={changePassword} 
				newVal="" />
		</Dialog>}
		</React.Fragment>
		)
	}
}

const mapStateToProps = (state: any) => {
    return {
		inCreateMode: state.editor.present.inCreateMode,
		inEdit: state.validation.inEdit,
		showPasswordModal: state.ui.showPasswordModal,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
		changePassword: ({id, value}: any) => {
			dispatch(ActionGroup.changeUserData(id, 'password', value))
		},
		togglePasswordModal: () => {
			dispatch(ActionGroup.togglePasswordModal())
		}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordModal)