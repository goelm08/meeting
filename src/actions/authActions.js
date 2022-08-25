import axios from "axios";
import { returnStatus } from "./statusActions";

import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_SUCCESS,
  AUTH_FAIL,
  LOGOUT_SUCCESS,
  IS_LOADING,
} from "./types";

//Uncomment below for local testing
// axios.defaults.baseURL = "http://localhost:5000";

//uncomment and set url to your own for prod
//axios.defaults.baseURL = "https://demos.shawndsilva.com/sessions-auth-app"

//Check if user is already logged in
export const isAuth = () => (dispatch) => {

  axios
    .get("http://localhost:4001/api/users/authchecker", { withCredentials: true })
    .then((res) =>
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data
      })
    )
    .catch((err) => {
      dispatch({
        type: AUTH_FAIL
      });
    });

}

// Register New User
export const register = ({ name, email, password }) => async (dispatch) => {
  // Headers
  const headers = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request body
  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("http://localhost:4001/api/users/register", body, headers)
    console.log(res.data);
    dispatch(returnStatus(res.data, res.status, 'REGISTER_SUCCESS'));
    dispatch({ type: IS_LOADING })
  } catch (err) {
    console.log(err);
    dispatch(returnStatus(err.response.data, err.response.status, 'REGISTER_FAIL'))
    dispatch({
      type: REGISTER_FAIL
    });
    dispatch({ type: IS_LOADING })
  }


};

//Login User
export const login = ({ email, password }) => async (dispatch) => {
  // Headers
  const headers = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request body
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("http://localhost:4001/api/users/login", body, headers);
    dispatch(returnStatus('Login successfully', res.status, 'LOGIN_SUCCESS'));
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch({ type: IS_LOADING })
  } catch (err) {
    console.log(err);
    dispatch(returnStatus(err.response.data, err.response.status, 'LOGIN_FAIL'));
    dispatch({
      type: LOGIN_FAIL
    });
    dispatch({ type: IS_LOADING })
  }


};

//Logout User and Destroy session
export const logout = () => async(dispatch) => {
    try{
      const headers = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const res = await axios.delete("http://localhost:4001/api/users/logout", headers);
      console.log(res);
      dispatch(returnStatus('Logout successfully', res.status, 'LOGOUT_SUCCESS'));
      dispatch({
        type: LOGOUT_SUCCESS,
      });
      dispatch({ type: IS_LOADING })
    }catch(err){
      // dispatch({ type: IS_LOADING })
      console.log(err.message);
    }
}