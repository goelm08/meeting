import {
  BUTTON_CLICKED,
  BUTTON_RESET,
  IS_LOADING
} from "./types";

import Camera from '../components/camera.js'

export const buttonClicked = () => (dispatch, getState) => {
  dispatch({type: BUTTON_CLICKED});
};

export const buttonReset = () => (dispatch, getState) => {
  dispatch({type: BUTTON_RESET});
};

export const isLoading = () => (dispatch, getState) => {
  const data = Camera();
  dispatch({type: IS_LOADING});
};
