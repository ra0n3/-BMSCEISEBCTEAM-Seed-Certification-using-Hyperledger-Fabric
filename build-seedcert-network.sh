#!/bin/bash
#cp ./binary_mac/* .
export FABRIC_CFG_PATH=$PWD

chmod +x generate-certs.sh

sh ./generate-certs.sh

chmod +x docker-images.sh
sh ./docker-images.sh
docker-compose up -d



