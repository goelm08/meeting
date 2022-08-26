import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import styled from "styled-components";
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

// // Styles
// const StyledContactForm = styled.div`
//   width: 400px;
//   form {
//     display: flex;
//     align-items: flex-start;
//     flex-direction: column;
//     width: 100%;
//     font-size: 16px;
//     input {
//       width: 100%;
//       height: 35px;
//       padding: 7px;
//       outline: none;
//       border-radius: 5px;
//       border: 1px solid rgb(220, 220, 220);
//       &:focus {
//         border: 2px solid rgba(0, 206, 158, 1);
//       }
//     }
//     textarea {
//       max-width: 100%;
//       min-width: 100%;
//       width: 100%;
//       max-height: 100px;
//       min-height: 100px;
//       padding: 7px;
//       outline: none;
//       border-radius: 5px;
//       border: 1px solid rgb(220, 220, 220);
//       &:focus {
//         border: 2px solid rgba(0, 206, 158, 1);
//       }
//     }
//     label {
//       margin-top: 1rem;
//     }
//     input[type="submit"] {
//       margin-top: 2rem;
//       cursor: pointer;
//       background: rgb(249, 105, 14);
//       color: white;
//       border: none;
//     }
//   }
// `;

// npm i @emailjs/browser

const SendOtp = (props) => {

    // componentDidMount() {
    //     const secret = "TPQDAHVBZ5NBO5LFEQKC7V7UPATSSMFY"
    //     const options = {
    //         algorithm: "sha256",
    //         digits: 8,
    //         period: 20
    //     }

    //     const otp = new OTP(secret, options)
    //     const token = otp.getToken()
    //     this.setState({otp:token})
    //     console.log('working',this.state.otp);
    // }

    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        console.log(form.current);
        emailjs
            .sendForm(
                "service_grdhbhm",
                "template_h680a9y",
                form.current,
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

    return (
        <div>
            {/* // <StyledContactForm> */}
            <form ref={form} onSubmit={sendEmail}>
                {/* <label>Name</label> */}
                <input type="text" name="user_name" value={props.name} hidden />
                {/* <label>Email</label> */}
                <input type="email" name="user_email" value={props.email} hidden />
                {/* <label>OTP</label> */}
                <input name="message" value={props.otp} hidden />
                {/* <input type="submit" value="Send" /> */}
                <Button size="lg" color="dark" style={{ marginTop: "2rem" }} block>
                    {<span>Login</span>}
                </Button>
            </form>
            {/* // </StyledContactForm> */}
        </div>
    );
};

export default SendOtp;

