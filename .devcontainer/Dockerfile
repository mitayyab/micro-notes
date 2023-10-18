FROM node:20-alpine

ARG USERNAME=vscode
ARG USER_UID=1010
ARG USER_GID=$USER_UID

# Create user and group
RUN addgroup -g $USER_GID $USERNAME \
    && adduser -u $USER_UID -G $USERNAME -s /bin/sh -D $USERNAME

# Install necessary packages
RUN apk update && apk add --no-cache sudo bash git openssh

# Grant the user sudo privileges
RUN echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME


# Copy over the entrpoint file
COPY docker-entrypoint.sh /bin/docker-entrypoint.sh
RUN chmod +x /bin/docker-entrypoint.sh

# Startup script
ENTRYPOINT ["/bin/docker-entrypoint.sh","/bin/bash"]

# Change to non-root user
USER $USERNAME

# Set workdir
WORKDIR /app
