import React, { useEffect, useRef } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

async function Camera() {
  const canvas = document.createElement('canvas');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    const [track] = stream.getVideoTracks();
    try {
      const imageCapture = new ImageCapture(track);

      // stopButton.onclick = () => track.stop();

      while (track.readyState == 'live') {
        const imgData = await imageCapture.grabFrame();
        canvas.width = imgData.width;
        canvas.height = imgData.height;
        canvas.getContext('2d').drawImage(imgData, 0, 0);
        await new Promise(r => setTimeout(r, 1000));
      }
    } finally {
      track.stop();
    }
  } catch (err) {
    console.error(err);
  }
  // console.log(canvas.toDataURL());
  return canvas.toDataURL();

}

export default Camera;