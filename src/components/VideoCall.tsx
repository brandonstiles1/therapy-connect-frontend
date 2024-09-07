import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

const VideoCall: React.FC = () => {
  const [socketId, setSocketId] = useState<string>("");
  const [peers, setPeers] = useState<any[]>([]);
  const socketRef = useRef<any>();
  const userVideo = useRef<any>();
  const peersRef = useRef<any[]>([]);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3001");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", "room_id");
        socketRef.current.on("all users", (users: string[]) => {
          const peers: any[] = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on(
          "user joined",
          (payload: { signal: any; callerID: string }) => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            });

            setPeers((users) => [...users, peer]);
          }
        );

        socketRef.current.on(
          "receiving returned signal",
          (payload: { id: string; signal: any }) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            item.peer.signal(payload.signal);
          }
        );
      });
  }, []);

  function createPeer(
    userToSignal: string,
    callerID: string,
    stream: MediaStream
  ) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal: any, callerID: string, stream: MediaStream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div>
      <video playsInline muted ref={userVideo} autoPlay />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
    </div>
  );
};

const Video: React.FC<{ peer: any }> = ({ peer }) => {
  const ref = useRef<any>();

  useEffect(() => {
    peer.on("stream", (stream: MediaStream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <video playsInline autoPlay ref={ref} />;
};

export default VideoCall;
