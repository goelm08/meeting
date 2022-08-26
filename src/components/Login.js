import React, { Component } from 'react'
import faker from "faker"
import OTP from 'otp-client';
import SendOtp from '../components/sendOtp';
import emailjs from "@emailjs/browser";



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
import { buttonClicked, isLoading } from "../actions/uiActions";
import { login } from "../actions/authActions";

import { Link } from 'react-router-dom'
import './style.css';



class Login extends Component {

  constructor() {
    super()
    this.state = {
      name: null,
      logged_in: false,
      email: "",
      password: "",
      msg: "",
      code: faker.internet.userName(),
      share: 0,
      show_otp_box: false,
      token: 0,
      otp: 0
    }
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
    if (code != null) {
      this.setState({ code: code });
      this.setState({ share: 1 });
    }

    this.props.buttonClicked();

    const secret = "TPQDAHVBZ5NBO5LFEQKC7V7UPATSSMFY"
    const options = {
      algorithm: "sha256",
      digits: 8,
      period: 20
    }

    const otp = new OTP(secret, options);
    console.log(otp);
    const token = otp.getToken();
    console.log(token);
    console.log('otp', token);
    this.setState({ token: token });
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
        this.props.history.push(`/video?email=${this.state.email}&code=${this.state.code}&share=${this.state.share}`);
      }, 1000);
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  sendEmail = (input) => {
    return emailjs
      .sendForm(
        "service_grdhbhm",
        "template_h680a9y",
        input,
        "r1vxtZanFOyMEzO7s"
      )
      .then(
        (result) => {
          console.log(result.text);
          console.log("message sent");
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    if (this.state.show_otp_box === false) { // login and send otp
      // const otpInput = 
      //     <form ref={this.form}>
      //       <input type="email" name="user_email" value={email} hidden />
      //       <input name="message" value={this.state.otp} hidden />
      //     </form>
      //   ;

      // // console.clear();
      // console.log(otpInput);

      // this.sendEmail(otpInput).then(() => {this.state.setState({ show_otp_box: true })});
      this.setState({ show_otp_box: true });
      return;
    }

    // i need to check otp
    if (this.state.otp != this.state.token) {
      // pop up for wrong otp
      return;
    }

    console.log('bhai login')


    const user = { email, password };
    this.props.isLoading();
    this.props.login(user);
  };

  login() {
    console.log('bhai login')
    fetch("http://127.0.0.1:5000/login")
      .then(res => res.text())
      .then((res) => {
        this.setState({ name: res, logged_in: true })
      })
  }

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
            <CardBody >
              <CardTitle> <h2><strong>Login</strong></h2></CardTitle>
              <CardSubtitle className="text-muted">Don't have an account?
                <Link to="/register"> Register. </Link></CardSubtitle>
              <br />
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



                  {this.state.show_otp_box === true &&
                    <>
                      <Label for="otp">Verify OTP</Label>
                      <Input
                        type="text"
                        name="otp"
                        id="otp"
                        size="lg"
                        placeholder="OTP"
                        className="mb-3"
                        onChange={this.onChange}
                      />
                    </>}

                  {<SendOtp name="" email={this.state.email} otp={this.state.token} />}

                  {/* <Button size="lg" color="dark" style={{ marginTop: "2rem" }} block>
                        {this.props.loading ?
                          <span >Logging in.. <Spinner size="sm" color="light" /></span> : <span>Login</span>}
                      </Button> */}


                </FormGroup>
              </Form>
            </CardBody>
          </div>
        </div>
      </div>


    </>
    )
  }
}

const mapStateToProps = (state) => ({ //Maps state element in redux store to props
  //location of element in the state is on the right and key is on the left
  button: state.ui.button, //store.getState().ui.button another way to get button bool
  isAuthenticated: state.auth.isAuthenticated,
  status: state.status,
  loading: state.ui.loading
});

export default connect(mapStateToProps, { login, isLoading, buttonClicked })(Login);
