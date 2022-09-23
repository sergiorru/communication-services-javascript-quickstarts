import { usePropsFor, VideoGallery, ControlBar, CameraButton, MicrophoneButton, ScreenShareButton, EndCallButton, useCall, useCallAgent } from '@azure/communication-react';
import { mergeStyles, Stack } from '@fluentui/react';
import { Button, Input } from "@fluentui/react-northstar";;

function CallingComponents(): JSX.Element {

  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const screenShareProps = usePropsFor(ScreenShareButton);
  const endCallProps = usePropsFor(EndCallButton);

  const call = useCall();
  const callAgent = useCallAgent();

  let meetingJoinUrl = '';

  console.log("call data:")
  console.log(call);

  if (call?.state === 'Disconnected') {
    return <CallEnded />;
  }
  
  console.log("Microphone Options: ");
  console.log(microphoneProps);

  console.log("Camera Options: ");
  console.log(cameraProps);

  console.log("Call Agent:")
  console.log(callAgent);

  return (
    <Stack className={mergeStyles({ height: '100%' })}>
      <div style={{ width: '100vw', height: '100vh' }}>
        {videoGalleryProps && <VideoGallery {...videoGalleryProps} />}
      </div>

      <ControlBar layout='floatingBottom'>
        {cameraProps && <CameraButton  {...cameraProps} />}
        {microphoneProps && <MicrophoneButton  {...microphoneProps} />}
        {screenShareProps && <ScreenShareButton  {...screenShareProps} />}
        {endCallProps && <EndCallButton {...endCallProps} />}
      </ControlBar>
    </Stack>
  );
}



function CallEnded(): JSX.Element {
  return <h1>You ended the call.</h1>;
}

export default CallingComponents;