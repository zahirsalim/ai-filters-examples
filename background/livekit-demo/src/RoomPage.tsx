import { faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CreateAudioTrackOptions, createLocalAudioTrack, createLocalVideoTrack, CreateVideoTrackOptions, Room, RoomEvent, TrackPublishOptions, LocalVideoTrack } from 'livekit-client'
import { LiveKitRoom } from 'livekit-react'
import React, { useState } from "react"
import "react-aspect-ratio/aspect-ratio.css"
import { useHistory, useLocation } from 'react-router-dom'
import  {BackgroundFilter}  from '@vectorly-io/ai-filters';
console.log('BackgroundFilter :>> ', BackgroundFilter);

export const RoomPage = () => {
  const [numParticipants, setNumParticipants] = useState(0)
  const history = useHistory()
  const query = new URLSearchParams(useLocation().search)
  const url = query.get('url')
  const token = query.get('token')

  if (!url || !token) {
    return (
      <div>
        url and token are required
      </div>
    )
  }

  const onLeave = () => {
    history.push({
      pathname: '/',
    })
  }

  const updateParticipantSize = (room: Room) => {
    setNumParticipants(room.participants.size + 1);
  }

  return (
    <div className="roomContainer">
      <div className="topBar">
        <h2>LiveKit Video</h2>
        <div className="participantCount">
          <FontAwesomeIcon icon={faUserFriends} />
          <span>{numParticipants}</span>
        </div>
      </div>
      <LiveKitRoom
        url={url}
        token={token}
        onConnected={room => {
          onConnected(room, query);
          room.on(RoomEvent.ParticipantConnected, () => updateParticipantSize(room))
          room.on(RoomEvent.ParticipantDisconnected, () => updateParticipantSize(room))
          updateParticipantSize(room);
        }}
        onLeave={onLeave}
        adaptiveVideo={true}
      />
    </div>
  )
}

async function onConnected(room: Room, query: URLSearchParams) {
  // make it easier to debug
  (window as any).currentRoom = room;

  if (isSet(query, 'audioEnabled')) {
    const options: CreateAudioTrackOptions = {}
    const audioDeviceId = query.get('audioDeviceId');
    if (audioDeviceId) {
      options.deviceId = audioDeviceId;
    }
    const audioTrack = await createLocalAudioTrack(options)
    await room.localParticipant.publishTrack(audioTrack)
  }
  if (isSet(query, 'videoEnabled')) {
    const videoDeviceId = query.get('videoDeviceId');
    const captureOptions: CreateVideoTrackOptions = {}
    if (videoDeviceId) {
      captureOptions.deviceId = videoDeviceId;
    }
    const videoTrack = await createLocalVideoTrack(captureOptions);

    const inputStream = new MediaStream([videoTrack.mediaStreamTrack])
    const filter = new BackgroundFilter(inputStream, 
      {
        token: 'your-vectorly-token',
        model: 'webgl' || 'selfie', // switch between models as per client device performance; read more here: https://vectorly.io/docs/docs-page.html#item-webgl-model
        background: 'blur',
        debug: false,
        analyticsEnabled: false,
        passthrough: true,
        frameRate: 30,
        segmentationFrameRate: 15
      }
    );
    const outputStream = await filter.getOutput()
    const videoTrackWithBG = new LocalVideoTrack(outputStream.getVideoTracks()[0])
    
    const publishOptions: TrackPublishOptions = {
      name: 'camera'
    }
    if (isSet(query, 'simulcast')) {
      publishOptions.simulcast = true
    }
    await room.localParticipant.publishTrack(videoTrackWithBG, publishOptions)
  }
}

function isSet(query: URLSearchParams, key: string): boolean {
  return query.get(key) === '1' || query.get(key) === 'true'
}