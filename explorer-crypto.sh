echo
echo "#################################################################"
echo "#######  Setting cryptos for the Hyperledger Explorer  ##########"
echo "#################################################################"
PROJPATH=$(pwd)
CLIPATH=$PROJPATH/cli/peers
EXPPATH=$PROJPATH/explorer

rm -rf $EXPPATH/crypto

mkdir $EXPPATH/crypto
cp -r $CLIPATH/. $EXPPATH/crypto

mv $EXPPATH/crypto/peerOrganizations/farmer-org/users/Admin@farmer-org/msp/keystore/*_sk $EXPPATH/crypto/peerOrganizations/bank-org/users/Admin@farmer-org/msp/keystore/priv_sk
mv $EXPPATH/crypto/peerOrganizations/govt-org/users/Admin@govt-org/msp/keystore/*_sk $EXPPATH/crypto/peerOrganizations/govt-org/users/Admin@govt-org/msp/keystore/priv_sk
mv $EXPPATH/crypto/peerOrganizations/passport-org/users/Admin@passport-org/msp/keystore/*_sk $EXPPATH/crypto/peerOrganizations/passport-org/users/Admin@passport-org/msp/keystore/priv_sk
mv $EXPPATH/crypto/ordererOrganizations/orderer-org/users/Admin@orderer-org/msp/keystore/*_sk $EXPPATH/crypto/ordererOrganizations/orderer-org/users/Admin@orderer-org/msp/keystore/priv_sk

echo "### cryptos are ready ###"