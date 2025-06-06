import React, { useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { toast } from 'react-toastify';

function LiveStream({ stream }) {
  const videoRef = useRef();

  useEffect(() => {
    let peer;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(mediaStream) => {
        peer = new Peer({ initiator: stream.isHost, stream: mediaStream });
        videoRef.current.srcObject = mediaStream;

        peer.on('stream', remoteStream => {
          videoRef.current.srcObject = remoteStream;
        });
      .catch(err => {
        console.error('Media error:', err);
        toast.error('Failed to access media devices');
      });

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      peer?.destroy();
    };
  }, [stream.isHost]);

  return (
    <div className="live-stream">
      <h3>{stream.title} by {stream.userId}</h3>
      <video ref={videoRef} autoPlay controls />
    </div>
  );
}

export default LiveStream;
