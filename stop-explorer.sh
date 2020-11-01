cd explorer
docker-compose down -v

# images=( hyperledger/explorer hyperledger/explorer-db)
# for i in "${images[@]}"
# do
# 	echo Removing image : $i
#   docker rmi -f $(docker images | grep $i )
# done