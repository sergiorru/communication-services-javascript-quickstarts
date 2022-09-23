import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  FluentThemeProvider,
  DEFAULT_COMPONENT_ICONS,
  CallClientProvider,
  CallAgentProvider,
  CallProvider,
  createStatefulCallClient,
  StatefulCallClient
} from '@azure/communication-react';
import React, { useEffect, useState } from 'react';
import CallingComponents from './CallingComponentsStateful';
import { registerIcons } from '@fluentui/react';
import { Call, CallAgent } from '@azure/communication-calling';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { v4 as uuidv4 } from 'uuid';

function App(): JSX.Element {
  var searchParameters = new URLSearchParams(window.location.search);
  
  let connectionString = atob(searchParameters.get('c') ?? '');
  let meetingJoinUrl = searchParameters.get('j') ?? '';
  let displayName =  searchParameters.get('un') ?? 'Robert Tolbert';
  let userId = searchParameters.get('uid') ?? uuidv4() ?? 'cd0828df-f463-442a-87cd-b5e175d32d9a';

  registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [call, setCall] = useState<Call>();

  useEffect(() => {
    setStatefulCallClient(createStatefulCallClient({
      userId: { communicationUserId: userId }
    }));
  }, []);

  useEffect(() => {
    const initData = async (): Promise<void> => {

      if (connectionString == '')
      {
        return;
      }

      const identityClient = new CommunicationIdentityClient(connectionString);
      let identityTokenResponse = await identityClient.createUserAndToken(["voip", "chat"]);
      const { token, expiresOn, user } = identityTokenResponse;
      const tokenCredential = new AzureCommunicationTokenCredential(token);
      if (callAgent === undefined && statefulCallClient && displayName) {
        const createUserAgent = async () => {
          setCallAgent(await statefulCallClient.createCallAgent(tokenCredential, { displayName: displayName }))
        }
        createUserAgent();
      }
    }

    initData();
  }, [statefulCallClient, displayName, callAgent]);

  useEffect(() => {
    if (callAgent !== undefined && meetingJoinUrl != '') {
      setCall(callAgent.join({ meetingLink: meetingJoinUrl }));
    }
  }, [callAgent]);

  if (connectionString === '' || meetingJoinUrl === '')
  {
    return(
      <>
        <FluentThemeProvider>
          <h1>Invalid parameters.</h1>
        </FluentThemeProvider>
      </>
    )
  }

  return (
    <>
      <FluentThemeProvider>
        {statefulCallClient && <CallClientProvider callClient={statefulCallClient}>
          {callAgent && <CallAgentProvider callAgent={callAgent}>
            {call && <CallProvider call={call}>
              <CallingComponents />
            </CallProvider>}
          </CallAgentProvider>}
        </CallClientProvider>}
      </FluentThemeProvider>
    </>
  );
}

export default App;
