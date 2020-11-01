#!/bin/bash
set -e

CORE_PEER_MSPCONFIGPATH=/peers/ordererOrganizations/orderer-org/orderers/orderer0/msp CORE_PEER_LOCALMSPID="OrdererMSP" peer channel create -o orderer0:7050 -c default -f /peers/orderer/channel.tx --tls true --cafile /peers/orderer/localMspConfig/cacerts/ordererOrg.pem

CORE_PEER_MSPCONFIGPATH=/peers/bankPeer/localMspConfig CORE_PEER_ADDRESS=bank-peer:7051 CORE_PEER_LOCALMSPID=BankOrgMSP CORE_PEER_TLS_ROOTCERT_FILE=/peers/bankPeer/localMspConfig/cacerts/bankOrg.pem peer channel join -b default.block

CORE_PEER_MSPCONFIGPATH=/peers/passportPeer/localMspConfig CORE_PEER_ADDRESS=passport-peer:7051 CORE_PEER_LOCALMSPID=PassportOrgMSP CORE_PEER_TLS_ROOTCERT_FILE=/peers/passportPeer/localMspConfig/cacerts/passportOrg.pem peer channel join -b default.block

CORE_PEER_MSPCONFIGPATH=/peers/govtPeer/localMspConfig CORE_PEER_ADDRESS=govt-peer:7051 CORE_PEER_LOCALMSPID=GovtOrgMSP CORE_PEER_TLS_ROOTCERT_FILE=/peers/govtPeer/localMspConfig/cacerts/govtOrg.pem peer channel join -b default.block

## Don't use TLS
# CORE_PEER_MSPCONFIGPATH=/peers/orderer/localMspConfig CORE_PEER_LOCALMSPID="OrdererMSP" peer channel create -o orderer0:7050 -c default -f /peers/orderer/channel.tx
#
# CORE_PEER_MSPCONFIGPATH=/peers/insurancePeer/localMspConfig CORE_PEER_ADDRESS=insurance-peer:7051 CORE_PEER_LOCALMSPID=InsuranceOrgMSP peer channel join -b default.block
#
# CORE_PEER_MSPCONFIGPATH=/peers/shopPeer/localMspConfig CORE_PEER_ADDRESS=shop-peer:7051 CORE_PEER_LOCALMSPID=ShopOrgMSP peer channel join -b default.block
#
# CORE_PEER_MSPCONFIGPATH=/peers/repairShopPeer/localMspConfig CORE_PEER_ADDRESS=repairservice-peer:7051 CORE_PEER_LOCALMSPID=RepairShopOrgMSP peer channel join -b default.block
