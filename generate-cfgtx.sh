#!/bin/sh

CHANNEL_NAME="default"
PROJPATH=$(pwd)
CLIPATH=$PROJPATH/cli/peers
chmod +x configtxgen

echo
echo "##########################################################"
echo "#########  Generating Orderer Genesis block ##############"
echo "##########################################################"
$PROJPATH/configtxgen -profile ThreeOrgsGenesis -outputBlock $CLIPATH/genesis.block

echo
echo "#################################################################"
echo "### Generating channel configuration transaction 'channel.tx' ###"
echo "#################################################################"
$PROJPATH/configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx $CLIPATH/channel.tx -channelID $CHANNEL_NAME
cp $CLIPATH/channel.tx $PROJPATH/web
echo
echo "#################################################################"
echo "####### Generating anchor peer update for FarmerOrg ##########"
echo "#################################################################"
$PROJPATH/configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate $CLIPATH/FarmerOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg FarmerOrgMSP

echo
echo "#################################################################"
echo "#######    Generating anchor peer update for CertificateAgencyOrg   ##########"
echo "#################################################################"
$PROJPATH/configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate $CLIPATH/CertificateAgencyOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg CertificateAgencyOrgMSP

echo
echo "##################################################################"
echo "####### Generating anchor peer update for DistributorOrg ##########"
echo "##################################################################"
$PROJPATH/configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate $CLIPATH/DistributorOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg DistributorOrgMSP

echo
echo "##################################################################"
echo "####### Generating anchor peer update for RetailerOrg ##########"
echo "##################################################################"
$PROJPATH/configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate $CLIPATH/RetailerOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg RetailerOrgMSP
