# interview-smasher-backend

# Redis
- docker command to run redis
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
- to run redis-cli in command prompt
docker exec -it <imageid> bash