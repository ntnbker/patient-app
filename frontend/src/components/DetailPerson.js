import React, {Component} from 'react'
import {connect} from 'react-redux'
import cookie from 'react-cookie'
import '../css/components/detailperson.css'
import {
  loadDetailPatient,
  updateDetailpatient,
  dashboard
} from '../actions/patient'
import default_avatar from '../../public/avatar_default.jpg'

const information_id = cookie.load('information_id')

class DetailPerson extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contactsInfo: [{}],
      detailPatient: {},
      isUploadAvatar: false,
      avatarPreview: '',
      file: '',
      onlyView: false
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
    detailPatient.tags = detailPatient.tags && detailPatient.tags.join(',') || ''
    if (!detailPatient.plans) detailPatient.plans = {}
    if (!detailPatient.contacts || !detailPatient.contacts.length) {
      detailPatient.contacts = [{}]
    }
    this.setState({
      contactsInfo: detailPatient.contacts || [{}],
      detailPatient: detailPatient,
      avatarPreview: detailPatient.profilePicture || '',
      onlyView: information_id !== detailPatient._id
    })
  }

  _handleChangeAvatar(e) {
    e.preventDefault();

    let file = e.target.files[0];
    let fileSize = (file.size/1024).toFixed(4) // KB
    if (fileSize > 200) {
      window.alert('FILE TOO LARGE, PLEASE CHOOSE FILE < 200KB');
      return;
    }
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        file: file,
        avatarPreview: reader.result,
        isUploadAvatar: true
      });
    }

    reader.readAsDataURL(file)
  }

  _handleButtonBack() {
    this.props.dashboard()
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
    let {
      value
    } = event.target
    if (key === 'postalCode') {
      if (value != '' && !parseInt(value)) {
        window.alert('POSTAL CODE IS NUMBER');
      }
      else {
        contactsInfo[index][key] = parseInt(value) || value
      }
    }
    else {
      contactsInfo[index][key] = value
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
  

  _handleChooseAvatar() {
    this.refs.filePicker.click();
  }

  _handleSavebtn() {
    let {
      contactsInfo,
      detailPatient,
      avatarPreview,
      isUploadAvatar
    } = this.state
    
    detailPatient.contacts = contactsInfo.filter(contact => {
      return contact.address || parseInt(contact.postalCode) || contact.email
    })
    detailPatient.tags = detailPatient.tags && detailPatient.tags.replace(/\s+/g, '').split(',')
    if (detailPatient.plans.isYes !== 'yes') detailPatient.plans.descriptions = '';
    if (isUploadAvatar) detailPatient.profilePicture = avatarPreview
    else delete detailPatient.profilePicture
    
    return this.props.updateDetailpatient(detailPatient._id, detailPatient);
  }

  render() {
    let {
      contactsInfo,
      detailPatient,
      avatarPreview,
      isUploadAvatar,
      onlyView
    } = this.state
    let birthday = detailPatient.birthday && new Date(detailPatient.birthday);
    if (!detailPatient.plans) detailPatient.plans = ''
    let date = birthday && 
        (birthday.getFullYear().toString() + '-' + 
        (birthday.getMonth() < 9 ? '0' : '') + (birthday.getMonth() + 1) + '-' + 
        (birthday.getDate() < 10 ? '0' : '') + birthday.getDate())
    let $planning = this.buildPlanning(detailPatient.plans && detailPatient.plans.isYes);
    let $gender = this.buildGender(detailPatient.gender);
    let $contacts = this.buildContacts(contactsInfo);
    return (
      <div className="app-container">
        <div className="app-detail-person">
          <div className="row">
            <div className="col-sm-2 col-xs-12">
              <img src={avatarPreview || default_avatar} alt="Avatar" className="detail-person-avatar" height="100px" width="100px"/>
              <input accept="image/*" type="file" ref="filePicker" width="100px" style={{display:"none"}} onChange={this._handleChangeAvatar.bind(this)}/>
              <input type="button" value="Browse..." style={{display: onlyView ? 'none':'block'}} onClick={this._handleChooseAvatar.bind(this)} />
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
                    value={detailPatient.name || '' }
                    disabled={onlyView}
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
                    disabled={onlyView}
                    onChange={this._handleChangeField.bind(this, 'birthday')}
                    />
                </div>
              </div>
              {$gender}
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
                  value={detailPatient.pastMedication  || ''}
                  disabled={onlyView}
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
                  value={ detailPatient.tags || '' }
                  disabled={onlyView}
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
              {$contacts}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <h3 className="" style={{fontSize: '17px'}}>Are you planning for pregnancy?</h3>
              {$planning}
            </div>
            <div className="col-xs-12">&nbsp;</div>
            <div className="col-xs-12">
            {
              detailPatient.plans && detailPatient.plans['isYes'] === 'yes' ? (
                <div className="detail-person-survey">
                  <p className="">PLEASE ELABORATE</p>
                  <input type="text" className="form-control input-sm"
                    value={detailPatient.plans.descriptions || ''}
                    disabled={onlyView}
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
            <button className="col-sm-1 btn btn-primary" style={{display: onlyView ? 'none':'block', margin: '0 20px'}} onClick={this._handleSavebtn.bind(this)}>SAVE</button>
            <button className="col-sm-1 btn btn-primary" onClick={this._handleButtonBack.bind(this)}>BACK</button>
          </div>
        </div>
      </div>
    )
  }
  
  buildPlanning(isYes) {
    const { onlyView } = this.state
    return isYes === 'yes' ? 
    (
      <div className="">
        <div className="col-sm-6">
          <input 
            type="radio" 
            name="plan" 
            value='yes'
            disabled={onlyView}
            checked
            onChange={this._handleChangePlans.bind(this, 'isYes')}
          />
          <span>   Yes</span>
        </div>
        <div className="col-sm-6">
          <input 
            type="radio" 
            name="plan" 
            value='no'
            disabled={onlyView}
            onChange={this._handleChangePlans.bind(this, 'isYes')}
          />
          <span>   No</span>
        </div>
      </div>
    )
    :
    (
      <div className="">
        <div className="col-sm-6">
          <input 
            type="radio" 
            name="plan" 
            value='yes'
            disabled={onlyView}
            onChange={this._handleChangePlans.bind(this, 'isYes')}
          />
          <span>   Yes</span>
        </div>
        <div className="col-sm-6">
          <input 
            type="radio" 
            name="plan" 
            value="no"
            disabled={onlyView}
            checked
            onChange={this._handleChangePlans.bind(this, 'isYes')}
          />
          <span>   No</span>
        </div>
      </div>
    )
  }

  buildGender(gender) {
    const { onlyView } = this.state
    return (
      <div className="col-sm-6 col-xs-12 detail-person-birthday">
          <p className="">GENDER</p>
          {
            gender === 'male' ? (
              <div className="col-xs-12">
                <div className="col-sm-6">
                  <input 
                    type="radio" 
                    name="gender" 
                    value='male'
                    disabled={onlyView}
                    checked
                    onChange={this._handleChangeField.bind(this, 'gender')}
                  />
                  <span>  Male</span>
                </div>
                <div className="col-sm-6">
                  <input 
                    type="radio" 
                    name="gender" 
                    value='female'
                    disabled={onlyView}
                    onChange={this._handleChangeField.bind(this, 'gender')}
                  />
                  <span>  Female</span>
                </div>
              </div>
            )
            :
            (
              <div className="">
                <div className="col-sm-6">
                  <input 
                    type="radio" 
                    name="gender" 
                    value='male'
                    disabled={onlyView}
                    onChange={this._handleChangeField.bind(this, 'gender')}
                  />
                  <span>  Male</span>
                </div>
                <div className="col-sm-6">
                  <input 
                    type="radio" 
                    name="gender" 
                    value='female'
                    disabled={onlyView}
                    checked
                    onChange={this._handleChangeField.bind(this, 'gender')}
                  />
                  <span>  Female</span>
                </div>
              </div>
            )
          }
        </div>
    ) 
  }

  buildContacts(contacts) {
    const { onlyView } = this.state
    return contacts.map((item, idx) => {
      return idx === contacts.length - 1 ? 
      (
        [
          <div className="row" key={idx}>
            <div className="col-sm-6 col-xs-12">
              <div className="detail-person-adress">
                <p className="">ADDRESS</p>
                <input 
                  type="text" 
                  className="form-control input-sm"
                  value={ item.address || ''}
                  disabled={onlyView}
                  onChange={this._handleChangeContact.bind(this, 'address', idx)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-xs-12">
              <div className="detail-person-postalcode">
                <p className="">POSTAL CODE</p>
                <input type="number" className="form-control input-sm"
                  value={ item.postalCode || ''}
                  disabled={onlyView}
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
                  value={ item.email || ''}
                  disabled={onlyView}
                  onChange={this._handleChangeContact.bind(this, 'email', idx)}
                />
              </div>
            </div>
          </div>,
          <div className="row detail-contact-add" style={{display: onlyView ? 'none' : 'block'}} onClick={this._handleAddContact.bind(this)}>
            + Add another contact
          </div>
        ]
      )
      :
      (
          <div className="row" key={idx}>
              <div className="col-sm-6 col-xs-12">
                <div className="detail-person-adress">
                  <p className="">ADDRESS</p>
                  <input 
                    type="text" 
                    className="form-control input-sm"
                    value={ item.address  || ''}
                    disabled={onlyView}
                    onChange={this._handleChangeContact.bind(this, 'address', idx)}
                  />
                </div>
              </div>
              <div className="col-sm-6 col-xs-12">
                <div className="detail-person-postalcode">
                  <p className="">POSTAL CODE</p>
                  <input type="text" className="form-control input-sm"
                    value={ item.postalCode || '' }
                    disabled={onlyView}
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
                    value={ item.email || '' }
                    disabled={onlyView}
                    onChange={this._handleChangeContact.bind(this, 'email', idx)}
                  />
                </div>
              </div>
        </div>
      )
    })
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
export default connect(mapStateToProps,{
  loadDetailPatient,
  updateDetailpatient,
  dashboard
})(DetailPerson)