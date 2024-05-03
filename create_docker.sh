docker rmi docker-data --force
docker rmi docker-back --force
docker rmi docker-front --force

cd web/backend/data
docker build -t docker-data .
cd ..
docker build -t docker-back .
cd ../frontend
docker build -t docker-front .
cd ../..