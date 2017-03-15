import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { auth } from '../../actions/auth'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import SignUp from './SignUp'
import '../../css/components/login.css'
class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isLogin: true,
			language: 'en'
		}
		this._handleClickLogin = this._handleClickLogin.bind(this)
		this._handleSwitchAuth = this._handleSwitchAuth.bind(this)
	}

	_handleClickLogin(values) {
		// console.log('click auth', values)
		// values.password = values.username
		// console.log(values);
		this.props.auth('local', values)
	}

	_handleSwitchAuth() {
		this.setState({
			isLogin: !this.state.isLogin
		})
	}
	componentWillMount() {
	}
	render() {
		const { 
			isFetching, 
			handleSubmit, 
			pristine, 
			submitting,
			message, 
			isAuthenticated,
		} = this.props
		const { isLogin, language } = this.state
		return (
			<div className="loginContainer">
				{isLogin &&
				<div className="row">
					<div className="col-md-9">
					<form onSubmit={handleSubmit(this._handleClickLogin)}>
			      <Field className="form-control" name="username" type="text" component="input" placeholder={language === 'cn' ? '用户名' : 'Username'}/>
			      <Field className="form-control" name="password" type="password" component="input" placeholder={language === 'cn' ? '用户名' : 'Password'}/>
			      {isAuthenticated == false && message && <strong style={{margin: '0 15px'}}>{message}</strong>}
		      	<button
			      	className="btn btnAuth bg-cyan"
		      		type="submit"
				    disabled={pristine || submitting || isFetching}
				    	>{language === 'cn' ?
				    		'登录'
				    		:
				    		'Submit'
				    	}
				    </button>
				  </form>
				  </div>
				  <div className="col-md-3">
				  <button
				  	className="btn btnSwitchAuth"
		  			onClick={this._handleSwitchAuth}
		  			>{language === 'cn' ?
							'或者注册新帐号'
							:
			  			'Register new account'
			  		}
		  		</button>
		  		</div>
			  </div>
			  }
			  { !isLogin && 
			  	<div className="row">
							<div className="col-md-9">
			  				<SignUp />
			  			</div>
			  			<div className="col-md-3">
					  		<button
						    	className="btn btnSwitchAuth"
						      onClick={this._handleSwitchAuth}
						    >{language === 'cn' ?
						    	'返回'
						    	:
						    	'Back'
						    }
						    </button>
						  </div>
			  	</div>
			  }
			</div>
		)
	}
}

Login.propTypes = {
	isFetching: PropTypes.bool,
	isAuthenticated: PropTypes.bool,
	message: PropTypes.string,
	changeRegion: PropTypes.func
}

function mapStateToProps(state) {
	const {
		auth: { isFetching, isAuthenticated, message }
	} = state

	return {
		isFetching,
		isAuthenticated,
		message
	}
}

Login = connect(mapStateToProps, {
	auth
})(Login)
Login = reduxForm({
	form: 'login',
	validate
})(Login)
export default Login