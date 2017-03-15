import React, {Component} from 'react'
import {connect} from 'react-redux'
import '../css/components/detailperson.css'
import {
	loadDetailPatient,
	updateDetailpatient
} from '../actions/patient'
class DetailPerson extends Component {
	constructor(props) {
		super(props)
		this.state = {
			contactsInfo: [{}],
			detailPatient: {},
			isUploadAvatar: false,
			avatarPreview: '',
			file: ''
		}
	}

	componentWillMount() {
		this.props.loadDetailPatient(this.props.params.patient_id)
	}

	componentWillReceiveProps(props) {
		let {
			detailPatient
		} = props
		if (!detailPatient.gender) detailPatient.gender = 'female'
		detailPatient.tags = detailPatient.tags && detailPatient.tags.join(',')
		if (!detailPatient.plans) detailPatient.plans = {}
		this.setState({
			contactsInfo: detailPatient.contacts || [{}],
			detailPatient: detailPatient,
			avatarPreview: detailPatient.profilePicture || ''
		})
	}



  _handleChangeAvatar(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        avatarPreview: reader.result,
        isUploadAvatar: true
      });
    }

    reader.readAsDataURL(file)
  }

	_handleAddContact() {
		let {
			contactsInfo
		} = this.state

		this.setState({
			contactsInfo: contactsInfo.concat({})
		})
	}

	_handleChangeContact(key, index, event) {

		let {
			contactsInfo
		} = this.state
		if (key === 'postalCode') {
			if (!parseInt(event.target.value)) {
				window.alert('POSTAL CODE IS NUMBER');
				event.target.value = ''
			}
			else {
				contactsInfo[index][key] = parseInt(event.target.value)
			}
		}
		else {
			contactsInfo[index][key] = event.target.value
		}

		this.setState({
			contactsInfo
		})
	}

	_handleChangePlans(key, event) {
		let {
			detailPatient
		} = this.state
		detailPatient.plans[key] = event.target.value
		this.setState({
			detailPatient
		})
	}

	_handleChangeField(key, event) {
		let {
			detailPatient
		} = this.state
		detailPatient[key] = event.target.value
		this.setState({
			detailPatient
		})
	}

	_handleSavebtn() {
		let {
			contactsInfo,
			detailPatient,
			avatarPreview,
			isUploadAvatar
		} = this.state
		contactsInfo = contactsInfo.filter(contact => {
			return contact.address || parseInt(contact.postalCode) || contact.email
		})
		detailPatient.contacts = contactsInfo;
		detailPatient.tags = detailPatient && detailPatient.tags.replace(/\s+/g, '').split(',')
		if (detailPatient.plans.isYes !== 'yes') detailPatient.plans.descriptions = '';
		if (isUploadAvatar) detailPatient.profilePicture = avatarPreview
		if (Object.keys(detailPatient).length) {
			return this.props.updateDetailpatient(detailPatient._id, detailPatient);
		}
		else window.alert('NOTHING_CHANGE');
	}
	render() {
		let {
			contactsInfo,
			detailPatient,
			avatarPreview,
			isUploadAvatar
		} = this.state
		let birthday = detailPatient.birthday && new Date(detailPatient.birthday);
		if (!detailPatient.plans) detailPatient.plans = {}
		let date = birthday && 
				(birthday.getFullYear().toString() + '-' + 
				(birthday.getMonth() < 9 ? '0' : '') + (birthday.getMonth() + 1) + '-' + 
				(birthday.getDate() < 10 ? '0' : '') + birthday.getDate())
		let $avatar = (
				<img  src={avatarPreview} onclick="document.getElementById('selectedFile').click();" alt="Avatar" className="detail-person-avatar" height="100px" width="100px"/>
				)
		return (
			<div className="app-container">
				<div className="app-detail-person">
					<div className="row">
						<div className="col-sm-2 col-xs-12">
							{$avatar}
							<input accept="image/*" type="file" id="filePicker" width="100px" style={{display: "none"}} onChange={this._handleChangeAvatar.bind(this)}/>
						</div>
						<div className="col-sm-10 col-xs-12">
							<div className="col-sm-6 col-xs-12">
								<div className="detail-person-id">
									<p className="">PATIENT ID</p>
									<input 
										type="text" 
										className="form-control input-sm"
										readOnly
										value={detailPatient._id}
										/>
								</div>
							</div>
							<div className="col-sm-6 col-xs-12">
								<div className="detail-person-name">
									<p className="">Name</p>
									<input 
										type="text" 
										className="form-control input-sm"
										value={detailPatient.name}
										onChange={this._handleChangeField.bind(this, 'name')}
										/>
								</div>
							</div>
							<div className="col-xs-12">&nbsp;</div>
							<div className="col-sm-6 col-xs-12">
								<div className="detail-person-birthday">
									<p className="">BirthDay</p>
									<input 
										type="date" 
										className="form-control input-sm"
										value={date}
										onChange={this._handleChangeField.bind(this, 'birthday')}
										/>
								</div>
							</div>
							<div className="col-sm-6 col-xs-12">
								<div className="detail-person-birthday">
									<p className="">GENDER</p>
									{
										detailPatient.gender === 'male' ? (
											<div className="">
												<input 
													type="radio" 
													name="gender" 
													value='male'
													checked
													onChange={this._handleChangeField.bind(this, 'gender')}
												/>
												<span>Male</span>
												<input 
													type="radio" 
													name="gender"
													value='female'
													onChange={this._handleChangeField.bind(this, 'gender')}
												/>
												<span>Female</span>
											</div>
										)
										:
										(
											<div className="">
												<input 
													type="radio" 
													name="gender" 
													value='male'
													onChange={this._handleChangeField.bind(this, 'gender')}
												/>
												<span>Male</span>
												<input 
													type="radio" 
													name="gender"
													value='female'
													checked
													onChange={this._handleChangeField.bind(this, 'gender')}
												/>
												<span>Female</span>
											</div>
										)
									}
								</div>
							</div>
							<div className="col-xs-12">&nbsp;</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<div className="detail-person-mediacation">
								<p className="">PAST MEDIACATION</p>
								<input 
									type="text" 
									className="form-control input-sm"
									value={detailPatient.pastMedication}
									onChange={this._handleChangeField.bind(this, 'pastMedication')}
								/>
							</div>
						</div>
						<div className="col-xs-12">&nbsp;</div>
						<div className="col-xs-12">
							<div className="detail-person-tags">
								<p className="">TAGS</p>
								<input 
									type="text" 
									className="form-control input-sm"
									value={ detailPatient.tags }
									onChange={this._handleChangeField.bind(this, 'tags')}
								/>
							</div>
						</div>
						<div className="col-xs-12" style={{borderBottom: '1px solid lightgray'}}>&nbsp;</div>
					</div>
					<div className="row row-eq-height detail-contact">
						<div className="col-sm-1 col-xs-12">
							CONTACT
						</div>
						<div className="col-sm-11 col-xs-12">
							{contactsInfo.map((item, idx) => {
								if(idx === contactsInfo.length - 1) {
									return (
										[
											<div className="row" key={idx}>
												<div className="col-sm-6 col-xs-12">
													<div className="detail-person-adress">
														<p className="">ADDRESS</p>
														<input 
															type="text" 
															className="form-control input-sm"
															value={ item.address }
															onChange={this._handleChangeContact.bind(this, 'address', idx)}
														/>
													</div>
												</div>
												<div className="col-sm-6 col-xs-12">
													<div className="detail-person-postalcode">
														<p className="">POSTAL CODE</p>
														<input type="text" className="form-control input-sm"
															value={ item.postalCode }
															onChange={this._handleChangeContact.bind(this, 'postalCode', idx)}
														/>
													</div>
												</div>
												<div className="col-xs-12">&nbsp;</div>
												<div className="col-xs-12">
													<div className="detail-person-email">
														<p className="">EMAIL</p>
														<input 
															type="email" 
															className="form-control input-sm"
															value={ item.email }
															onChange={this._handleChangeContact.bind(this, 'email', idx)}
														/>
													</div>
												</div>
											</div>,
											<div className="row detail-contact-add" onClick={this._handleAddContact.bind(this)}>
												+ Add another contact
											</div>
										]
									)
								}
								else {
									return (
										<div className="row" key={idx}>
												<div className="col-sm-6 col-xs-12">
													<div className="detail-person-adress">
														<p className="">ADDRESS</p>
														<input 
															type="text" 
															className="form-control input-sm"
															value={ item.address }
															onChange={this._handleChangeContact.bind(this, 'address', idx)}
														/>
													</div>
												</div>
												<div className="col-sm-6 col-xs-12">
													<div className="detail-person-postalcode">
														<p className="">POSTAL CODE</p>
														<input type="text" className="form-control input-sm"
															value={ item.postalCode }
															onChange={this._handleChangeContact.bind(this, 'postalCode', idx)}
														/>
													</div>
												</div>
												<div className="col-xs-12">&nbsp;</div>
												<div className="col-xs-12">
													<div className="detail-person-email">
														<p className="">EMAIL</p>
														<input 
															type="email" 
															className="form-control input-sm"
															value={ item.email }
															onChange={this._handleChangeContact.bind(this, 'email', idx)}
														/>
													</div>
												</div>
											</div>
									)
								}
							})}
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<h3 className="" style={{fontSize: '17px'}}>Are you planning for pregnancy?</h3>
							{
										detailPatient.plans && detailPatient.plans['isYes'] === 'yes' ? (
											<div className="">
												<input 
													type="radio" 
													name="plan" 
													value='yes'
													checked
													onChange={this._handleChangePlans.bind(this, 'isYes')}
												/>
												<span>Yes</span>
												<input 
													type="radio" 
													name="plan"
													value='no'
													onChange={this._handleChangePlans.bind(this, 'isYes')}
												/>
												<span>No</span>
											</div>
										)
										:
										(
											<div className="">
												<input 
													type="radio" 
													name="plan" 
													value='yes'
													onChange={this._handleChangePlans.bind(this, 'isYes')}
												/>
												<span>Yes</span>
												<input 
													type="radio" 
													name="plan"
													value='no'
													checked
													onChange={this._handleChangePlans.bind(this, 'isYes')}
												/>
												<span>No</span>
											</div>
										)
									}
						</div>
						<div className="col-xs-12">&nbsp;</div>
						<div className="col-xs-12">
						{
							detailPatient.plans && detailPatient.plans['isYes'] === 'yes' ? (
								<div className="detail-person-survey">
									<p className="">PLEASE ELABORATE</p>
									<input type="text" className="form-control input-sm"
										value={detailPatient.plans.descriptions}
										onChange={this._handleChangePlans.bind(this, 'descriptions')}
									/>
								</div>
							)
							:
							(
								<div className="detail-person-survey">
									<p className="">YOU CHOOSE NO</p>
									<input type="text" className="form-control input-sm" readOnly/>
								</div>
							)
						}
						</div>
						<div className="col-xs-12">&nbsp;</div>
					</div>
					<div className="row">
						<button className="btn btn-primary" onClick={this._handleSavebtn.bind(this)}>SAVE</button>
					</div>
				</div>
			</div>
		)
	} 
}

function mapStateToProps(state) {
	const {
		data: {
			patient: {
				detailPatient
			}
		}
	} = state
	return {detailPatient}

}
DetailPerson = connect(mapStateToProps,{
	loadDetailPatient,
	updateDetailpatient
})(DetailPerson)
export default DetailPerson