1. **Basic Docker Commands**:

   -  `docker ps` or `docker container ls`: List running containers.
   -  `docker ps -a` or `docker container ls -a`: List all containers (including stopped ones).
   -  `docker images` or `docker image ls`: List all images.
   -  `docker run <Image>`: Run a container from an image.
      -  Example: `docker run nginx`
   -  `docker stop <ContainerID>`: Stop a running container.
      -  Example: `docker stop 1a2b3c4d`
   -  `docker start <ContainerID>`: Start a stopped container.
      -  Example: `docker start 1a2b3c4d`
   -  `docker rm <ContainerID>`: Remove a container.
      -  Example: `docker rm 1a2b3c4d`
   -  `docker rmi <ImageID>`: Remove an image.
      -  Example: `docker rmi abc123def`
   -  `docker system prune -a`: cleans up unused Docker objects such as stopped containers, unused networks, dangling images, and build cache. The -a flag ensures that it also removes any unused images, not just dangling ones.

2. **Docker Compose Commands**:

   -  `docker-compose up`: Start services defined in `docker-compose.yml`.
      -  Note: Before running this command, you need to `cd` (change directory) into the directory that contains the `docker-compose.yml` file.
      -  Example: If your `docker-compose.yml` is located in a directory named "my_project", you would first run `cd my_project` and then execute `docker-compose up`.
   -  `docker-compose up --build --detach` or `docker-compose up -d --build`: Build the images (if they don't exist or have changes) and start the services defined in `docker-compose.yml` in detached mode (running in the background).
   -  `docker-compose down`: Stop and remove all services defined in `docker-compose.yml`.
   -  `docker-compose down --volumes --rmi all`: Stop and remove all services, volumes, and images defined in `docker-compose.yml`.
   -  `docker-compose logs`: View logs from services.

3. **Docker Network Commands**:

   -  `docker network ls`: List networks.
   -  `docker network create <NetworkName>`: Create a network.
      -  Example: `docker network create my-network`
   -  `docker network rm <NetworkName>`: Remove a network.
      -  Example: `docker network rm my-network`
   -  `docker network prune`: Deletes all unused networks.

4. **Docker Volume Commands**:

   -  `docker volume ls`: List volumes.
   -  `docker volume create <VolumeName>`: Create a volume.
      -  Example: `docker volume create my-volume`
   -  `docker volume rm <VolumeName>`: Remove a volume.
      -  Example: `docker volume rm my-volume`
   -  `docker volume prune -a`: Removes all unused volumes.

5. **Docker Image Commands**:

   -  `docker pull <ImageName>`: Pull an image from Docker Hub.
      -  Example: `docker pull nginx`
   -  `docker push <ImageName>`: Push an image to Docker Hub.
      -  Example: `docker push my-nginx`
   -  `docker build -t <ImageName> <Path>`: Build an image from a Dockerfile.
      -  Example: `docker build -t my-nginx .`
   -  `docker image prune -a`: Removes all unused images, not just dangling ones.

6. **Docker Info & Help**:
   -  `docker info`: Display system-wide information.
   -  `docker --version` or `docker -v`: Show the Docker version.
   -  `docker --help` or `docker -h`: Get help on Docker commands.

> Users can always refer to `docker --help` or `docker-compose --help` for a detailed list of commands and options.

> Always exercise caution when using these commands, especially in production environments, to avoid unintended data loss.
