'use strict';

import config,{ DEFAULT_USERS } from './config';
import { OrganizationClient } from './utils';
import http from 'http';
import url from 'url';

let status = 'down';
let statusChangedCallbacks = [];

// Setup clients per organization
const bankClient = new OrganizationClient(
  config.channelName,
  config.orderer0,
  config.bankOrg.peer,
  config.bankOrg.ca,
  config.bankOrg.admin
);
const govtClient = new OrganizationClient(
  config.channelName,
  config.orderer0,
  config.govtOrg.peer,
  config.govtOrg.ca,
  config.govtOrg.admin
);
const passportClient = new OrganizationClient(
  config.channelName,
  config.orderer0,
  config.passportOrg.peer,
  config.passportOrg.ca,
  config.passportOrg.admin
);
// const policeClient = new OrganizationClient(
//   config.channelName,
//   config.orderer0,
//   config.policeOrg.peer,
//   config.policeOrg.ca,
//   config.policeOrg.admin
// );

function setStatus(s) {
  status = s;

  setTimeout(() => {
    statusChangedCallbacks
      .filter(f => typeof f === 'function')
      .forEach(f => f(s));
  }, 1000);
}

export function subscribeStatus(cb) {
  if (typeof cb === 'function') {
    statusChangedCallbacks.push(cb);
  }
}

export function getStatus() {
  return status;
}

export function isReady() {
  return status === 'ready';
}

function getAdminOrgs() {
  return Promise.all([
    bankClient.getOrgAdmin(),
    govtClient.getOrgAdmin(),
    passportClient.getOrgAdmin(),
    // policeClient.getOrgAdmin()
  ]);
}

(async () => {
  // Login
  try {
    await Promise.all([
      bankClient.login(),
      govtClient.login(),
      passportClient.login(),
      // policeClient.login()
    ]);
  } catch (e) {
    console.log('Fatal error logging into blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }

  // Bootstrap blockchain network
  try {
    await getAdminOrgs();
    if (!(await bankClient.checkChannelMembership())) {
      console.log('Default channel not found, attempting creation...');
      const createChannelResponse =
        await bankClient.createChannel(config.channelConfig);
      //console.log(createChannelResponse);
      if (createChannelResponse.status === 'SUCCESS') {
        console.log('Successfully `created` a new default channel.');
        console.log('Joining peers to the default channel.');
        await Promise.all([
          bankClient.joinChannel(),
          govtClient.joinChannel(),
          passportClient.joinChannel(),
          // policeClient.joinChannel()
        ]);
        // Wait for 10s for the peers to join the newly created channel
        await new Promise(resolve => {
          setTimeout(resolve, 10000);
        });
      }
      else  {
        console.log("Channel not created");
      }
    }
  } catch (e) {
    console.log('Fatal error bootstrapping the blockchain network!');
    console.log(e);
    process.exit(-1);
  }

  // Register block events
  try {
    console.log('Connecting and Registering Block Events');
    bankClient.connectAndRegisterBlockEvent();
    govtClient.connectAndRegisterBlockEvent();
    passportClient.connectAndRegisterBlockEvent();
    // policeClient.connectAndRegisterBlockEvent();
  } catch (e) {
  console.log('Fatal error register block event!');
  console.log(e);
  process.exit(-1);
  }

  // Initialize network
  try {
    await Promise.all([
      bankClient.initialize(),
      govtClient.initialize(),
      passportClient.initialize(),
      // policeClient.initialize()
    ]);
  } catch (e) {
    console.log('Fatal error initializing blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  }

  // Install chaincode on all peers
  let installedOnBankOrg, installedOnGovtOrg, installedOnPassportOrg,
    installedOnPoliceOrg;
  try {
    await getAdminOrgs();
    installedOnBankOrg = await bankClient.checkInstalled(
      config.chaincodeId, config.chaincodeVersion, config.chaincodePath);
    installedOnGovtOrg = await govtClient.checkInstalled(
      config.chaincodeId, config.chaincodeVersion, config.chaincodePath);
    installedOnPassportOrg = await passportClient.checkInstalled(
      config.chaincodeId, config.chaincodeVersion, config.chaincodePath);
    // installedOnPoliceOrg = await policeClient.checkInstalled(
    //   config.chaincodeId, config.chaincodeVersion, config.chaincodePath);
  } catch (e) {
    console.log('Fatal error getting installation status of the chaincode!');
    console.log(e);
    process.exit(-1);
  }

  if (!(installedOnBankOrg && installedOnGovtOrg &&
    installedOnPassportOrg )) {
    console.log('Chaincode is not installed, attempting installation...');

    // Pull chaincode environment base image
    try {
      await getAdminOrgs();
      const socketPath = process.env.DOCKER_SOCKET_PATH ||
      (process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock');
      const ccenvImage = process.env.DOCKER_CCENV_IMAGE ||
        'hyperledger/fabric-ccenv:latest';
      const listOpts = { socketPath, method: 'GET', path: '/images/json' };
      const pullOpts = {
        socketPath, method: 'POST',
        path: url.format({ pathname: '/images/create', query: { fromImage: ccenvImage } })
      };

      const images = await new Promise((resolve, reject) => {
        const req = http.request(listOpts, (response) => {
          let data = '';
          response.setEncoding('utf-8');
          response.on('data', chunk => { data += chunk; });
          response.on('end', () => { resolve(JSON.parse(data)); });
        });
        req.on('error', reject); req.end();
      });

      const imageExists = images.some(
        i => i.RepoTags && i.RepoTags.some(tag => tag === ccenvImage));
      if (!imageExists) {
        console.log(
          'Base container image not present, pulling from Docker Hub...');
        await new Promise((resolve, reject) => {
          const req = http.request(pullOpts, (response) => {
            response.on('data', () => { });
            response.on('end', () => { resolve(); });
          });
          req.on('error', reject); req.end();
        });
        console.log('Base container image downloaded.');
      } else {
        console.log('Base container image present.');
      }
    } catch (e) {
      console.log('Fatal error pulling docker images.');
      console.log(e);
      process.exit(-1);
    }

    // Install chaincode
    const installationPromises = [
      bankClient.install(
        config.chaincodeId, config.chaincodeVersion, config.chaincodePath),
      govtClient.install(
        config.chaincodeId, config.chaincodeVersion, config.chaincodePath),
      passportClient.install(
        config.chaincodeId, config.chaincodeVersion, config.chaincodePath),
      // policeClient.install(
      //   config.chaincodeId, config.chaincodeVersion, config.chaincodePath)
    ];
    try {
      await Promise.all(installationPromises);
      await new Promise(resolve => {   setTimeout(resolve, 10000); });
      console.log('Successfully installed chaincode on the default channel.');
    } catch (e) {
      console.log('Fatal error installing chaincode on the default channel!');
      console.log(e);
      process.exit(-1);
    }

    // Instantiate chaincode on all peers
    // Instantiating the chaincode on a single peer should be enough (for now)
    try {
      // Initial contract types
      await bankClient.instantiate(config.chaincodeId,
        config.chaincodeVersion, DEFAULT_USERS );
      // await govtClient.instantiate(config.chaincodeId,
      //   config.chaincodeVersion );
      // await passportClient.instantiate(config.chaincodeId,
      //   config.chaincodeVersion );
      console.log('Successfully instantiated chaincode on all peers.');
      setStatus('ready');
    } catch (e) {
      console.log('Fatal error instantiating chaincode on some(all) peers!');
      console.log(e);
      process.exit(-1);
    }
  } else {
    console.log('Chaincode already installed on the blockchain network.');
    setStatus('ready');
  }
})();

// Export organization clients
export {
  bankClient,
  govtClient,
  passportClient,
  // policeClient
};
