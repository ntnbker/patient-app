import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { signUp } from '../../actions/auth'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { FormControl } from 'react-bootstrap'
const validate = values => {
  const errors = {}
  const requiredFields = ['username', 'password']
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })
  return errors
}

class SignUp extends Component {
	constructor(props) {
		super(props)
		this._handleClickSignUp = this._handleClickSignUp.bind(this)
	}

	_handleClickSignUp(values) {
		console.log('click auth', values)
		// values.password = values.email
		return this.props.signUp(values)
	}

	render() {
		const { 
			isSignUp, 
			error, 
			handleSubmit, 
			pristine, 
			reset, 
			submitting, 
			message,
		} = this.props
		let language = 'en'
		return (
			<div>
				<form onSubmit={handleSubmit(this._handleClickSignUp)}>
				  <Field className="form-control" name="username" type="text" component="input" placeholder={language === 'cn' ? '用户名' : "UserName"}/>
				  <Field className="form-control" name="password" type="password" component="input" placeholder={language === 'cn' ? '用户名' : "Password"}/>
		      {!isSignUp && message && <strong style={{margin: '0 15px'}}>{message}</strong>}	
	      	<button
	      		className="btn btnAuth bg-cyan"
	      		type="submit"
				disabled={pristine || submitting || isSignUp}
			    >
			    {language === 'cn' ?
					'注册'
					:
					'Register'
				}
			    </button>
			   </form>
			</div>
		)
	}
}

SignUp.PropTypes = {
	isFetching: PropTypes.bool,
	isSignUp: PropTypes.bool,
	message: PropTypes.string,
	userInfo: PropTypes.object
}

function mapStateToProps(state) {
	const {
		signUp: { isFetching, isSignUp, message, userInfo }
	} = state

	return {
		isFetching,
		isSignUp,
		message,
		userInfo
	}
}

SignUp = connect(mapStateToProps, {signUp})(SignUp)
SignUp = reduxForm({
	form: 'signup',
	validate
})(SignUp)
export default SignUp