import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import InputAdornment from '@material-ui/core/InputAdornment';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import idGenerator from 'react-id-generator';
import OTP from 'otp-client';

import emailjs from "@emailjs/browser";
import styled from "styled-components";

const styles = {
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
};



class SendOtp extends Component {
    constructor(props) {
        super(props)
        this.form = React.useRef();
    }

    state = {
        phoneNo: '',
        age: '',
        multiline: 'Controlled',
        enterOtp: '',
        otp: idGenerator("REACTOTP"),
        verified: ''
    };

    componentDidMount() {
        const secret = "TPQDAHVBZ5NBO5LFEQKC7V7UPATSSMFY"
        const options = {
            algorithm: "sha256",
            digits: 8,
            period: 20
        }

        const otp = new OTP(secret, options)
        const token = otp.getToken()
        this.setState({ otp: token })
        console.log('working', this.state.otp);
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                "service_grdhbhm",
                "template_h680a9y",
                this.form.current,
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

    sendOtpHandler = () => {
        console.log('logged', this.state.name)
        console.log('otp', this.state.otp);
        const params = {
            apikey: 'P+uEzfbqb0I-5LZubEfVBlAa41jcKaE9N7LbHUUM71',
            numbers: '91' + this.state.phoneNo,
            message: 'Your OTP is ' + this.state.otp
        }
    }

    verifiyOtpHandler = () => {
        if (this.state.enterOtp === this.state.otp) {
            return this.setState({ verified: true });
        }
        if (this.state.enterOtp !== this.state.otp) {
            return this.setState({ verified: false });
        }
    }


    render() {
        const { classes } = this.props;
        return (
            <div style={{ margin: 250 }}>
                <StyledContactForm>
                    <form ref={this.state.form} onSubmit={this.sendEmail}>
                        <label>Name</label>
                        <input type="text" name="user_name" />
                        <label>Email</label>
                        <input type="email" name="user_email" />
                        <textarea name="message" placeholder={this.state.otp} readonly hidden />
                        <input type="submit" value="Send" />
                    </form>
                </StyledContactForm>

                <TextField
                    id="outlined-name"
                    label="ENTER OTP"
                    value={this.state.enterOtp}
                    onChange={this.handleChange('enterOtp')}
                    margin="normal"
                    variant="outlined"
                />
                <Button style={{ margin: 10, marginTop: 25 }} variant="contained" onClick={this.verifiyOtpHandler}
                    color="primary">
                    Verifiy
                </Button>
                <div>
                    <Card className={classes.card}>
                        {this.state.verified === true ? <Typography>OTP Verified </Typography> :
                            <Typography></Typography>}
                        {this.state.verified === false ? <Typography>Invalid Otp</Typography> :
                            <Typography></Typography>}


                    </Card>
                    <Typography>Only Indian Number, Check console log for Json response from SMS operater</Typography>
                </div>
            </div>

        );
    }
}

const StyledContactForm = styled.div`
  width: 400px;
  form {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    font-size: 16px;
    input {
      width: 100%;
      height: 35px;
      padding: 7px;
      outline: none;
      border-radius: 5px;
      border: 1px solid rgb(220, 220, 220);
      &:focus {
        border: 2px solid rgba(0, 206, 158, 1);
      }
    }
    textarea {
      max-width: 100%;
      min-width: 100%;
      width: 100%;
      max-height: 100px;
      min-height: 100px;
      padding: 7px;
      outline: none;
      border-radius: 5px;
      border: 1px solid rgb(220, 220, 220);
      &:focus {
        border: 2px solid rgba(0, 206, 158, 1);
      }
    }
    label {
      margin-top: 1rem;
    }
    input[type="submit"] {
      margin-top: 2rem;
      cursor: pointer;
      background: rgb(249, 105, 14);
      color: white;
      border: none;
    }
  }
`;

export default withStyles(styles)(SendOtp);