import React, { Component } from 'react'
import faker from "faker"



import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
   CardTitle,
   CardSubtitle,
  CardBody,
  Alert,
  Spinner
} from "reactstrap";
import { connect } from "react-redux"; // API to connect component state to redux store
import PropTypes from "prop-types";
import { buttonClicked,isLoading } from "../actions/uiActions";
import { login } from "../actions/authActions";

import { Link } from 'react-router-dom'
import './style.css';



class Login extends Component {

  state = {
    email: "",
    password: "",
    msg: "",
    code:faker.internet.userName()
  }

  static propTypes = {
    buttonClicked: PropTypes.func.isRequired,
    isLoading: PropTypes.func.isRequired,
    button: PropTypes.bool,
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    status: PropTypes.object.isRequired,
    loading: PropTypes.bool
  };

  componentDidMount() {
  		var url_string = window.location.href;
  		var url = new URL(url_string);
  		var code = url.searchParams.get('code');
  		console.log(code);
  		if( code != null ){
  	        this.setState({code:code});
  	    }
        this.props.buttonClicked();
  }

  componentDidUpdate(prevProps) {
      const status = this.props.status;

      // Changes status message if it is different from previous message
      if (status !== prevProps.status) {
        if (status.id === "LOGIN_FAIL") {
          this.setState({ msg: status.statusMsg });
        } else {
          this.setState({ msg: this.props.status.statusMsg });
        }
      }

      // Redirects to Log In screen after a delay of 2secs if successfully registered
      if (status.id === "LOGIN_SUCCESS") {
        setTimeout(() => {
        console.log(this.state.email);
        console.log(this.state.code);
      this.props.history.push(`/video?email=${this.state.email}&code=${this.state.code}`);
        }, 1000);
      }
  }



onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

onSubmit = (e) => {
    e.preventDefault();

    const { email, password} = this.state;

    const user = { email, password};
    this.props.isLoading();
    this.props.login(user);
  };


  render() {
    let className = 'divStyle';
    if (!this.props.button) {
      className = 'formStyle';
    }
    return (<>
      <div className='Background'>
      <img className="BackgroundImg" src="/background.jpg"></img>
        <div className='MainContainer'>
          <div className='LeftHalf'>
            <img className='Logo' src='/e-meeting-logos_black.png' ></img>
          </div>

            <div className='divCard'>
            {/* <Card> */}
                <CardBody >
                  <CardTitle> <h2><strong>Login</strong></h2></CardTitle>
                <CardSubtitle className="text-muted">Don't have an account?
                <Link to="/register"> Register. </Link></CardSubtitle>
                <br/>
                {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
                  <Form onSubmit={this.onSubmit} >
                  <FormGroup>

                    <Label for="email">E-mail</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      size="lg"
                      placeholder="you@youremail.com"
                      className="mb-3"
                      onChange={this.onChange}
                    />

                    <Label for="password">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      size="lg"
                      placeholder="Enter your Password"
                      className="mb-3"
                      onChange={this.onChange}
                    />
                    <Button size="lg" color="dark" style={{ marginTop: "2rem" }} block>
                       { this.props.loading ?
                       <span >Logging in.. <Spinner size="sm" color="light" /></span> : <span>Login</span>}
                    </Button>
                  </FormGroup>
                </Form>
                </CardBody>
            {/* </Card> */}
            </div>
        </div>
      </div>
      </>)
  }
}

const mapStateToProps = (state) => ({ //Maps state element in redux store to props
  //location of element in the state is on the right and key is on the left
  button: state.ui.button, //store.getState().ui.button another way to get button bool
  isAuthenticated: state.auth.isAuthenticated,
  status: state.status,
  loading: state.ui.loading
});

export default connect(mapStateToProps,{ login, isLoading, buttonClicked })(Login);
