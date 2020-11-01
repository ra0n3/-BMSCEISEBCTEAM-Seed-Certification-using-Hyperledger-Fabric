#!/bin/sh
set -e

echo
echo "#################################################################"
echo "#######        Generating cryptographic material       ##########"
echo "#################################################################"
PROJPATH=$(pwd)
CLIPATH=$PROJPATH/cli/peers
ORDERERS=$CLIPATH/ordererOrganizations
PEERS=$CLIPATH/peerOrganizations

rm -rf $CLIPATH

chmod +x cryptogen

$PROJPATH/cryptogen generate --config=$PROJPATH/crypto-config.yaml --output=$CLIPATH

chmod +x generate-cfgtx.sh

sh generate-cfgtx.sh

#Creating the peer directories to store the cryptos

rm -rf $PROJPATH/{orderer,farmerPeer,certificateAgencyPeer,distributorPeer,retailerPeer}/crypto
mkdir $PROJPATH/{orderer,farmerPeer,certificateAgencyPeer,distributorPeer,retailerPeer}/crypto
cp -r $ORDERERS/orderer-org/orderers/orderer0/{msp,tls} $PROJPATH/orderer/crypto

cp -r $PEERS/farmer-org/peers/farmer-peer/{msp,tls} $PROJPATH/farmerPeer/crypto
cp -r $PEERS/certificateAgency-org/peers/certificateAgency-peer/{msp,tls} $PROJPATH/certificateAgencyPeer/crypto
cp -r $PEERS/distributor-org/peers/distributor-peer/{msp,tls} $PROJPATH/distributorPeer/crypto

cp -r $PEERS/retailer-org/peers/retailer-peer/{msp,tls} $PROJPATH/retailerPeer/crypto

cp $CLIPATH/genesis.block $PROJPATH/orderer/crypto/


# Creating CA

FARMERCAPATH=$PROJPATH/farmerCA
CERTIFICATEAGENCYCAPATH=$PROJPATH/certificateAgencyCA
DISTRIBUTORCAPATH=$PROJPATH/distributorCA
RETAILERCAPATH=$PROJPATH/retailerCA

rm -rf {$FARMERCAPATH,$CERTIFICATEAGENCYCAPATH,$DISTRIBUTORCAPATH,$RETAILERCAPATH}/{ca,tls}
mkdir -p {$FARMERCAPATH,$CERTIFICATEAGENCYCAPATH,$DISTRIBUTORCAPATH,$RETAILERCAPATH}/{ca,tls}

#copy generated creds to the farmer ca path
cp $PEERS/farmer-org/ca/* $FARMERCAPATH/ca/
cp $PEERS/farmer-org/tlsca/* $FARMERCAPATH/tls/
echo "#######"
# Renaming with correct extension and name for all keys

mv $FARMERCAPATH/ca/*_sk $FARMERCAPATH/ca/key.pem
mv $FARMERCAPATH/ca/*-cert.pem $FARMERCAPATH/ca/cert.pem
mv $FARMERCAPATH/tls/*_sk $FARMERCAPATH/tls/key.pem
mv $FARMERCAPATH/tls/*-cert.pem $FARMERCAPATH/tls/cert.pem


#copy generated creds to the certificateAgency ca path
cp $PEERS/certificateAgency-org/ca/* $CERTIFICATEAGENCYCAPATH/ca
cp $PEERS/certificateAgency-org/tlsca/* $CERTIFICATEAGENCYCAPATH/tls

# Renaming with correct extension and name for all keys
mv $CERTIFICATEAGENCYCAPATH/ca/*_sk $CERTIFICATEAGENCYCAPATH/ca/key.pem
mv $CERTIFICATEAGENCYCAPATH/ca/*-cert.pem $CERTIFICATEAGENCYCAPATH/ca/cert.pem
mv $CERTIFICATEAGENCYCAPATH/tls/*_sk $CERTIFICATEAGENCYCAPATH/tls/key.pem
mv $CERTIFICATEAGENCYCAPATH/tls/*-cert.pem $CERTIFICATEAGENCYCAPATH/tls/cert.pem

#copy generated creds to the distributor ca path
cp $PEERS/distributor-org/ca/* $DISTRIBUTORCAPATH/ca
cp $PEERS/distributor-org/tlsca/* $DISTRIBUTORCAPATH/tls

# Renaming with correct extension and name for all keys
mv $DISTRIBUTORCAPATH/ca/*_sk $DISTRIBUTORCAPATH/ca/key.pem
mv $DISTRIBUTORCAPATH/ca/*-cert.pem $DISTRIBUTORCAPATH/ca/cert.pem
mv $DISTRIBUTORCAPATH/tls/*_sk $DISTRIBUTORCAPATH/tls/key.pem
mv $DISTRIBUTORCAPATH/tls/*-cert.pem $DISTRIBUTORCAPATH/tls/cert.pem


#copy generated creds to the retailer ca path
cp $PEERS/retailer-org/ca/* $RETAILERCAPATH/ca
cp $PEERS/retailer-org/tlsca/* $RETAILERCAPATH/tls

# Renaming with correct extension and name for all keys
mv $RETAILERCAPATH/ca/*_sk $RETAILERCAPATH/ca/key.pem
mv $RETAILERCAPATH/ca/*-cert.pem $RETAILERCAPATH/ca/cert.pem
mv $RETAILERCAPATH/tls/*_sk $RETAILERCAPATH/tls/key.pem
mv $RETAILERCAPATH/tls/*-cert.pem $RETAILERCAPATH/tls/cert.pem



WEBCERTS=$PROJPATH/web/certs
rm -rf $WEBCERTS
mkdir -p $WEBCERTS
cp $PROJPATH/orderer/crypto/tls/ca.crt $WEBCERTS/ordererOrg.pem
cp $PROJPATH/farmerPeer/crypto/tls/ca.crt $WEBCERTS/farmerOrg.pem
cp $PROJPATH/certificateAgencyPeer/crypto/tls/ca.crt $WEBCERTS/certificateAgencyOrg.pem
cp $PROJPATH/distributorPeer/crypto/tls/ca.crt $WEBCERTS/distributorOrg.pem
cp $PROJPATH/retailerPeer/crypto/tls/ca.crt $WEBCERTS/retailerOrg.pem

cp $PEERS/farmer-org/users/Admin@farmer-org/msp/keystore/* $WEBCERTS/Admin@farmer-org-key.pem
cp $PEERS/farmer-org/users/Admin@farmer-org/msp/signcerts/* $WEBCERTS/
cp $PEERS/certificateAgency-org/users/Admin@certificateAgency-org/msp/keystore/* $WEBCERTS/Admin@certificateAgency-org-key.pem
cp $PEERS/certificateAgency-org/users/Admin@certificateAgency-org/msp/signcerts/* $WEBCERTS/
cp $PEERS/distributor-org/users/Admin@distributor-org/msp/keystore/* $WEBCERTS/Admin@distributor-org-key.pem
cp $PEERS/distributor-org/users/Admin@distributor-org/msp/signcerts/* $WEBCERTS/

cp $PEERS/retailer-org/users/Admin@retailer-org/msp/keystore/* $WEBCERTS/Admin@retailer-org-key.pem
cp $PEERS/retailer-org/users/Admin@retailer-org/msp/signcerts/* $WEBCERTS/
