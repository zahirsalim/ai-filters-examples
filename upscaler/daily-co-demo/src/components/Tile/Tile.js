import React, { useEffect, useMemo, useRef } from 'react';
import './Tile.css';
import Upscaler from '@vectorly/ai-upscaler-plugin';
// const Upscaler = require('./vectorly.js')

function getTrackUnavailableMessage(kind, trackState) {
  if (!trackState) return;
  switch (trackState.state) {
    case 'blocked':
      if (trackState.blocked.byPermissions) {
        return `${kind} permission denied`;
      } else if (trackState.blocked.byDeviceMissing) {
        return `${kind} device missing`;
      }
      break
    case 'off':
      if (trackState.off.byUser) {
        return `${kind} muted`;
      } else if (trackState.off.byBandwidth) {
        return `${kind} muted to save bandwidth`;
      }
      break
    case 'sendable':
      return `${kind} not subscribed`;
    case 'loading':
      return `${kind} loading...`;
    case 'interrupted':
      return `${kind} interrupted`;
    case 'playable':
      return null;
    default:
      return null;
  }
}

/**
 * Props
 * - videoTrackState: DailyTrackState?
 * - audioTrackState: DailyTrackState?
 * - isLocalPerson: boolean
 * - isLarge: boolean
 * - disableCornerMessage: boolean
 * - onClick: Function
 */
export default function Tile(props) {
  const videoEl = useRef(null);
  const audioEl = useRef(null);

  const videoTrack = useMemo(() => {
    return props.videoTrackState && props.videoTrackState.state === 'playable'
      ? props.videoTrackState.track
      : null;
  }, [props.videoTrackState]);

  const audioTrack = useMemo(() => {
    return props.audioTrackState && props.audioTrackState.state === 'playable'
      ? props.audioTrackState.track
      : null;
  }, [props.audioTrackState]);

  const videoUnavailableMessage = useMemo(() => {
    return getTrackUnavailableMessage('video', props.videoTrackState);
  }, [props.videoTrackState]);

  const audioUnavailableMessage = useMemo(() => {
    return getTrackUnavailableMessage('audio', props.audioTrackState);
  }, [props.audioTrackState]);

  /**
   * When video track changes, update video srcObject
   */
  useEffect(() => {
    videoEl.current &&
      (videoEl.current.srcObject = new MediaStream([videoTrack]));
    if (videoEl.current && props.isLarge) {
      window.upscalers = window.upscalers || {}
      window.upscalers[videoTrack.id] = new Upscaler(videoEl.current, {id: videoTrack.id, height: 240, width: 320});
    }
  }, [videoTrack]);

  /**
   * When audio track changes, update audio srcObject
   */
  useEffect(() => {
    audioEl.current &&
      (audioEl.current.srcObject = new MediaStream([audioTrack]));
  }, [audioTrack]);

  function getVideoComponent() {
    return videoTrack && <video autoPlay muted playsInline ref={videoEl} />;
  }

  function getAudioComponent() {
    return (
      !props.isLocalPerson &&
      audioTrack && <audio autoPlay playsInline ref={audioEl} />
    );
  }

  function getOverlayComponent() {
    // Show overlay when video is unavailable. Audio may be unavailable too.
    return (
      videoUnavailableMessage && (
        <p className="overlay">
          {videoUnavailableMessage}
          {audioUnavailableMessage && (
            <>
              <br />
              {audioUnavailableMessage}
            </>
          )}
        </p>
      )
    );
  }

  function getCornerMessageComponent() {
    // Show corner message when only audio is unavailable.
    return (
      !props.disableCornerMessage &&
      audioUnavailableMessage &&
      !videoUnavailableMessage && (
        <p className="corner">{audioUnavailableMessage}</p>
      )
    );
  }

  function getClassNames() {
    let classNames = 'tile';
    classNames += props.isLarge ? ' large' : ' small';
    props.isLocalPerson && (classNames += ' local');
    return classNames;
  }

  return (
    <div className={getClassNames()} onClick={props.onClick}>
      <div className="background" />
      {getOverlayComponent()}
      {getVideoComponent()}
      {getAudioComponent()}
      {getCornerMessageComponent()}
    </div>
  );
}
