import {

  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_SUCCESS,
  AUTH_FAIL,
  LOGOUT_FAIL
} from "../actions/types";


const initialState = {
  isAuthenticated: null,
  user: null,
};

export default function (state = initialState, action) {

  switch (action.type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload
      };

    case LOGIN_SUCCESS:
      console.log(state);
      console.log(action.payload)
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
    
    case AUTH_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };

    case AUTH_ERROR:
    case LOGIN_FAIL: 
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      }
    case LOGOUT_SUCCESS: 
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      }

    case LOGOUT_FAIL: 
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      }

    case REGISTER_FAIL:
    case AUTH_FAIL:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      }

    default:
        return state;
  }

}