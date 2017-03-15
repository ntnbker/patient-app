import React, {Component, PropTypes } from 'react'
import {connect} from 'react-redux'
import Select from 'react-select'
import {loadListPatient, findListPatient} from '../actions/patient'
import {logout, getUserInfo} from '../actions/auth'
import '../css/components/dashboard.css'
import default_avatar from '../../public/avatar_default.jpg'
class DashBoard extends Component {
	constructor(props, context) {
		super(props)
		context.router
		this._handleClickRow = this._handleClickRow.bind(this)
		this.state = {
			conditions: {},
			skip: 0,
			limit: 30
		}
	}
	componentWillMount() {
		this.props.loadListPatient()
	}
	_handleClickRow(item) {
		console.log('item', item)
		this.context.router.push('/detail/' + item._id)
	}
	_handleViewProfile() {
		const {
			userInfo
		} = this.props
		return this.props.getUserInfo()
	}
	_handleConditions(key, event) {
		let {
			conditions
		} = this.state
		conditions[key] = event.target.value
	}
	_handleFindPatient() {
		let {
			conditions,
			skip,
			limit
		} = this.state
		this.props.findListPatient(conditions, skip, limit)
	}
	_handleLogout() {
		console.log('HAD LOGOUT')
		this.props.logout()
	}
	render() {
		let statusOptions = [
			{value: 1, label: 'open'}
		]
		let updateTimeOptions = [
			{value: 1, label: 'Last month'}
		]
		const {
			listPatient,
			userInfo,
			location
		} = this.props
		return (
			<div className="app-container">
				<div className="app-dashboard">
					<div className="dashboard-search">
						<div className="row">
							<div className="col-sm-5 col-sx-12">
								<input 
									type="text" 
									className="form-control" 
									id="find-value" 
									placeholder="Enter patient id, name, phone..."
									onChange={this._handleConditions.bind(this, 'valuesSearch')}
								/>
							</div>
							<div className="col-sm-4 col-sx-12">
								<input 
									type="text" 
									className="form-control" 
									id='hospital' 
									placeholder="Find all hospital"
									onChange={this._handleConditions.bind(this, 'hospital')}
								/>
							</div>
							<div className="col-sm-1 col-sx-12">
								<button className="btn btn-primary" onClick={this._handleFindPatient.bind(this)}>
									<i className="fa fa-search"></i>
									&nbsp;
									Find
								</button>
							</div>
							<div className="col-sm-1 col-sx-12" onClick={this._handleViewProfile.bind(this)}>
								<button className="btn btn-primary" >
									My Profile
								</button>
							</div>
							<div className="col-sm-1 col-sx-12" onClick={this._handleLogout.bind(this)}>
								<button className="btn btn-primary" >
									Logout
								</button>
							</div>
						</div>
					</div>
					<div className="dashboard-body">
						<div className="side-bar">
							<div className="row side-bar-item">
								<div className="col-xs-12">
									<span>STATUS</span>
								</div>
								<div className="col-sx-12">
									<Select
										name="dashboard-select-status" 
										simpleValue
										searchable={false}
										clearable={false}
										value={1}
										options={statusOptions}
									/>	
								</div>
							</div>
							<div className="row side-bar-item">
								<div className="col-xs-12">
									<span>UPDATE TIME</span>
								</div>
								<div className="col-sx-12">
									<Select
										name="dashboard-select-updatetime" 
										simpleValue
										searchable={false}
										clearable={false}
										value={1}
										options={updateTimeOptions}
									/>
								</div>
							</div>
						</div>
						<div className="dashboard-content">
							<div className="content-header">
								<h2 className="content-results">{listPatient.length}&nbsp;Results</h2>
							</div>
							<div className="content-body">
								{listPatient.map((item, idx) => {
									let time = new Date(item.lastUpdatedTime);
									console.log(time)
									return (
										<div 
											className="row content-row" 
											key={idx}
											onClick={this._handleClickRow.bind(this, item)}
											>
											<div className="col-xs-12">
												<div className="row row-eq-height">
													<div className="col-sm-2 col-xs-12">
														<img src={item.profilePicture || default_avatar} alt="avatar" className="person-avatar" height="100px" width="100px"/>
													</div>
													<div className="col-sm-6 col-xs-7">
														<h4 className="person-name">
															{item.name}/ 
															<span className="span-new-person">{item.status}</span>
														</h4>
														<p className="person-info">Cp full time</p>
														<p className="person-update-time">Update Time: {time.toString()}</p>
													</div>
													<div className="col-sm-4 col-sx-5 person-location">
														<i className="fa fa-map-marker"></i>
														&nbsp;
														{item.location || "VN"}
													</div>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

DashBoard.contextTypes = {
	router: PropTypes.object.isRequired
}

function mapStateToProps(state) {
	const {
		data: {
			patient: {
				listPatient
			}
		}
	} = state 
	return {
		listPatient
	}
}

DashBoard = connect(mapStateToProps, {
	loadListPatient,
	logout,
	getUserInfo,
	findListPatient
})(DashBoard)
export default DashBoard
