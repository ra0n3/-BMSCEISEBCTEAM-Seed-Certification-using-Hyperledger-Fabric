import { readFileSync } from 'fs';
import { resolve } from 'path';

const basePath = resolve(__dirname, '../../certs');
const readCryptoFile =
  filename => readFileSync(resolve(basePath, filename)).toString();
const config = {
  isCloud: false,
  isUbuntu: false,
  channelName: 'default',
  channelConfig: readFileSync(resolve(__dirname, '../../channel.tx')),
  chaincodeId: 'bckyc',
  chaincodeVersion: 'v2',
  chaincodePath: 'bckyc',
  orderer0: {
    hostname: 'orderer0',
    url: 'grpc://orderer0:7050',
    pem: readCryptoFile('ordererOrg.pem')
  },
  bankOrg: {
    peer: {
      hostname: 'bank-peer',
      url: 'grpc://bank-peer:7051',
      eventHubUrl: 'grpc://bank-peer:7053',
      pem: readCryptoFile('bankOrg.pem')
    },
    ca: {
      hostname: 'bank-ca',
      url: 'https://bank-ca:7054',
      mspId: 'BankOrgMSP'
    },
    admin: {
      key: readCryptoFile('Admin@bank-org-key.pem'),
      cert: readCryptoFile('Admin@bank-org-cert.pem')
    }
  },
  govtOrg: {
    peer: {
      hostname: 'govt-peer',
      url: 'grpc://govt-peer:7051',
      eventHubUrl: 'grpc://govt-peer:7053',
      pem: readCryptoFile('govtOrg.pem')
    },
    ca: {
      hostname: 'govt-ca',
      url: 'https://govt-ca:7054',
      mspId: 'GovtOrgMSP'
    },
    admin: {
      key: readCryptoFile('Admin@govt-org-key.pem'),
      cert: readCryptoFile('Admin@govt-org-cert.pem')
    }
  },
  // shopOrg: {
  //   peer: {
  //     hostname: 'shop-peer',
  //     url: 'grpcs://shop-peer:7051',
  //     eventHubUrl: 'grpcs://shop-peer:7053',
  //     pem: readCryptoFile('shopOrg.pem')
  //   },
  //   ca: {
  //     hostname: 'shop-ca',
  //     url: 'https://shop-ca:7054',
  //     mspId: 'ShopOrgMSP'
  //   },
  //   admin: {
  //     key: readCryptoFile('Admin@shop-org-key.pem'),
  //     cert: readCryptoFile('Admin@shop-org-cert.pem')
  //   }
  // },
  passportOrg: {
    peer: {
      hostname: 'passport-peer',
      url: 'grpc://passport-peer:7051',
      pem: readCryptoFile('passportOrg.pem'),
      eventHubUrl: 'grpc://passport-peer:7053',
    },
    ca: {
      hostname: 'passport-ca',
      url: 'https://passport-ca:7054',
      mspId: 'PassportOrgMSP'
    },
    admin: {
      key: readCryptoFile('Admin@passport-org-key.pem'),
      cert: readCryptoFile('Admin@passport-org-cert.pem')
    }
  }
};

if (process.env.LOCALCONFIG) {
  config.orderer0.url = 'grpcs://localhost:7050';

  config.bankOrg.peer.url = 'grpcs://localhost:7051';
  // config.shopOrg.peer.url = 'grpcs://localhost:8051';
  config.passportOrg.peer.url = 'grpcs://localhost:8051';
  config.govtOrg.peer.url = 'grpcs://localhost:9051';

  config.bankOrg.peer.eventHubUrl = 'grpcs://localhost:7053';
  // config.shopOrg.peer.eventHubUrl = 'grpcs://localhost:8053';
  config.passportOrg.peer.eventHubUrl = 'grpcs://localhost:8053';
  config.govtOrg.peer.eventHubUrl = 'grpcs://localhost:9053';

  config.bankOrg.ca.url = 'https://localhost:7054';
  // config.shopOrg.ca.url = 'https://localhost:8054';
  config.passportOrg.ca.url = 'https://localhost:8054';
  config.govtOrg.ca.url = 'https://localhost:9054';
}

export default config;

export const DEFAULT_USERS = 
  {
    username : 'admin',
    firstName : 'admin',
    lastName : 'admin',
    password : 'admin'
  };