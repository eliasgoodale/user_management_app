import { GridCell } from '@progress/kendo-react-grid';
import * as React from 'react';
import Button from '@material-ui/core/Button';
import VpnKey from '@material-ui/icons/VpnKey'

const styles = ({
	container: {
	  display: "flex",
	},
	button: {
	  margin: '5px',
	  fontSize: 10
	},
	icon: {
	  fontSize: 18,
	  marginRight: '5px'
	},
	buttonRight: {
	  margin: '5px',
	  marginLeft: 'auto'
	}
  });

export default function (togglePasswordModal: any, reactivateUser: any, inEdit: string) {
	return class extends GridCell {
		public render() {
			const { dataItem } = this.props
			return (
				dataItem.isActive && dataItem.inEdit ?
					<td>
						<Button
							variant="contained"
							size="small"
							style={styles.button}
							onClick={togglePasswordModal}
						>
						<VpnKey style={styles.icon}/>
							{dataItem.id === 'temp' ? 'Enter' : "Change"} Password
							
		  </Button>
					</td> :
					!dataItem.isActive && dataItem.inEdit ?
						<td>
							<Button
								variant="contained"
								size="small"
								style={styles.button}
								onClick={() => reactivateUser(inEdit)}
							>
								Reactivate User
					</Button>
						</td> : <td />
			);
		}
	};
}