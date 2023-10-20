FROM node:20-alpine

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Change uid and gid of node user to avoid conflict
RUN deluser --remove-home node \
    && addgroup -S node -g 2000 \
    && adduser -S -G node -u 2000 node

# Create user and group with 1000 uid and gid as work around for ubuntu wsl
RUN addgroup -g $USER_GID $USERNAME \
    && adduser -u $USER_UID -G $USERNAME -s /bin/sh -D $USERNAME

# Install necessary packages
RUN apk update && apk add --no-cache sudo bash git openssl openssh

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
WORKDIR /micro-notes
