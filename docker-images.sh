#!/bin/bash
set -eu

dockerFabricPull() {
  local FABRIC_TAG=$1
  for IMAGES in peer orderer ccenv; do
      echo "==> FABRIC IMAGE: $IMAGES"
      echo
      docker pull hyperledger/fabric-$IMAGES:$FABRIC_TAG
      docker tag hyperledger/fabric-$IMAGES:$FABRIC_TAG hyperledger/fabric-$IMAGES
  done
}

dockerCaPull() {
      local CA_TAG=$1
      echo "==> FABRIC CA IMAGE"
      echo
      docker pull hyperledger/fabric-ca:$CA_TAG
      docker tag hyperledger/fabric-ca:$CA_TAG hyperledger/fabric-ca
}

BUILD=
DOWNLOAD=
if [ $# -eq 0 ]; then
    BUILD=true
    PUSH=true
    DOWNLOAD=true
else
    for arg in "$@"
        do
            if [ $arg == "build" ]; then
                BUILD=true
            fi
            if [ $arg == "download" ]; then
                DOWNLOAD=true
            fi
    done
fi

if [ $DOWNLOAD ]; then
    : ${CA_TAG:="1.4"}
    : ${FABRIC_TAG:="1.4"}

    echo "===> Pulling fabric Images"
    dockerFabricPull ${FABRIC_TAG}

    echo "===> Pulling fabric ca Image"
    dockerCaPull ${CA_TAG}
    echo
    echo "===> List out hyperledger docker images"
    docker images | grep hyperledger*
fi

if [ $BUILD ];
    then
    echo
    echo '############################################################'
    echo '#                 BUILDING CONTAINER IMAGES                #'
    echo '############################################################'
    docker build -t orderer:latest orderer/

    echo
    echo '############################################################'
    echo '#             BUILDING FARMER CONTAINERIMAGES                #'
    echo '############################################################'
    docker build -t farmer-peer:latest farmerPeer/

    echo
    echo '############################################################'
    echo '#            BUILDING CERT AGENCY CONTAINER IMAGES            #'
    echo '############################################################'
    docker build -t certificateagency-peer:latest certificateAgencyPeer/

    echo
    echo '############################################################'
    echo '#             BUILDING Distributor CONTAINER IMAGES               #'
    echo '############################################################'
    docker build -t distributor-peer:latest distributorPeer/

    echo
    echo '############################################################'
    echo '#             BUILDING RETAILER CONTAINER IMAGES               #'
    echo '############################################################'
    docker build -t retailer-peer:latest retailerPeer/


    # echo
    # echo
    # echo '############################################################'
    # echo '#             BUILDING WEB CONTAINER IMAGES               #'
    # echo '############################################################'
    # docker build -t web:latest web/

    echo
    echo '############################################################'
    echo '#            BUILDING FARMER CA CONTAINER IMAGES             #'
    echo '############################################################'  
    docker build -t farmer-ca:latest farmerCA/

    echo
    echo '############################################################'
    echo '#        BUILDING CERT AGENCY CA CONTAINER IMAGES             #'
    echo '############################################################' 
    docker build -t certificateagency-ca:latest certificateAgencyCA/

    echo
    echo '############################################################'
    echo '#        BUILDING DISTRIBUTOR CA CONTAINER IMAGES                #'
    echo '############################################################' 
    docker build -t distributor-ca:latest distributorCA/

    echo
    echo '############################################################'
    echo '#        BUILDING RETAILER CA CONTAINER IMAGES                #'
    echo '############################################################' 
    docker build -t retailer-ca:latest retailerCA/
    

fi
