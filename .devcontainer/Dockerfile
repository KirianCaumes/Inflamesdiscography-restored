FROM debian:12

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# This Dockerfile adds a non-root user with sudo access. Use the "remoteUser"
# property in devcontainer.json to use it. On Linux, the container user's GID/UIDs
# will be updated to match your local UID/GID (when using the dockerFile property).
# See https://aka.ms/vscode-remote/containers/non-root-user for details.
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN apt-get clean
RUN apt-get update --allow-releaseinfo-change
RUN apt-get install gnupg -y \
    && apt-get install git -y \
    && apt-get install python3-pip -y \
    && apt-get install apt-transport-https -y \
    && apt-get install vim -y \
    && apt-get install curl -y \
    && apt-get install wget -y \
    && apt-get install unzip -y \
    && apt-get install procps -y \
    && apt-get install -y ruby

# install nodejs 26.x
RUN mkdir -p /etc/apt/keyrings && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_26.x nodistro main" > /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install -y nodejs

RUN gem install wayback_machine_downloader

WORKDIR /app_ruby

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=dialog