import express from 'express';

import * as BankPeer from '../blockchain/bankPeer';

const router = express.Router();

// Render main page
router.get('/', (req, res) => {
  res.render('bank-main', { insuranceActive: true });
});

router.post('/api/authenticate-user', async (req, res) => {
  if (!typeof req.body.user === 'object') {
    res.json({ error: 'Invalid request!' });
    return;
  }

  try {
    console.log("INSIDE API AUTH FUN");
    console.log(req.body);
    console.log(req.body);
    const { username, password } = req.body;
    console.log("Username in API", username );
    console.log("Password in API:", password);
    const success = await BankPeer.authenticateUser(username, password);
    res.json({ success });
    //return;
  } catch (e) {
    console.log(e);
    res.json({ error: 'Error accessing blockchain!' });
    return;
  }
});

router.post('/api/register-user', async (req, res) => {
  let  user  = req.body;
  let { firstName, lastName, username, password} = user || {};
  console.log(typeof user);
  console.log(typeof firstName);
  console.log(typeof lastName);
  console.log(typeof username);

  if (typeof user === 'object' &&
    typeof firstName === 'string' &&
    typeof lastName === 'string' &&
    typeof username === 'string' &&
    typeof password === 'string'){

    //let passwordProposal = generatePassword();
    try {
      let responseUser = await BankPeer.createUser({
        username: username,
        firstName: firstName,
        lastName: lastName,
        password: password
      });
      res.json(responseUser || { username: username, password: password });
    } catch (e) {
      console.log(e);
      res.json({ error: 'Could not create new user!' });
    }
  } else {
    res.json({ error: 'Invalid request!' });
  }
});

router.post('/api/get-user', async (req, res) => {
  let  user  = req.body;
  let { username } = user || {};
  if (typeof user === 'object' &&
    // typeof firstName === 'string' &&
    // typeof lastName === 'string' &&
    typeof username === 'string') {

    //let passwordProposal = generatePassword();
    try {
      let responseUser = await BankPeer.getUserInfo({
        username: username,
        // firstName: firstName,
        // lastName: lastName,
        // password: passwordProposal
      });
      res.json(responseUser);
    } catch (e) {
      console.log(e);
      res.json({ error: 'Could not create new user!' });
    }
  } else {
    res.json({ error: 'Invalid request!' });
  }
});

// function generatePassword() {
//   let passwordType = Math.floor(Math.random() * 4);
//   let password;
//   switch (passwordType) {
//     case 0:
//       password = 'test';
//       break;
//     case 1:
//       password = 'demo';
//       break;
//     case 2:
//       password = 'pass';
//       break;
//     case 3:
//       password = 'secret';
//       break;
//     case 4:
//     default:
//       password = 'qwerty';
//   }
//   password += Math.floor(Math.random() * (99 - 10) + 10);
//   return password;
// }

// Block explorer
router.post('/api/blocks', async (req, res) => {
  const { noOfLastBlocks } = req.body;
  if (typeof noOfLastBlocks !== 'number') {
    res.json({ error: 'Invalid request' });
  }
  try {
    const blocks = await BankPeer.getBlocks(noOfLastBlocks);
    res.json(blocks);
  } catch (e) {
    res.json({ error: 'Error accessing blockchain.' });
  }
});

// Otherwise redirect to the main page
router.get('*', (req, res) => {
  res.render('bank', {
    insuranceActive: true,
    selfServiceActive: req.originalUrl.includes('self-service'),
    claimProcessingActive: req.originalUrl.includes('claim-processing'),
    contractManagementActive: req.originalUrl.includes('contract-management')
  });
});

router.post('/api/getRegistered', function(req, res, next){
  BankPeer.createUser(req.body).then(function(bank){
      res.send(bank);
  }).catch(next);
});

router.post('/api/getUser', function(req, res, next){
  BankPeer.getUser(req.body).then(function(bank){
      res.send(bank);
  }).catch(next);
});

function wsConfig(io) {
  BankPeer.on('block', block => {
    io.emit('block', block);
  });
}

export default router;
export { wsConfig };
