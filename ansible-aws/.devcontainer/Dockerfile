#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

# To fully customize the contents of this image, use the following Dockerfile instead:
# https://github.com/microsoft/vscode-dev-containers/tree/v0.112.0/containers/ubuntu-18.04-git/.devcontainer/Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/base:0-ubuntu-18.04

ENV DEBIAN_FRONTEND=noninteractive

# Install additional packages
RUN apt-get update \
   && apt-get -y install --no-install-recommends \
   nano ansible python3-venv python3-pip python3-setuptools \
   #
   # Clean up
   && apt-get autoremove -y \
   && apt-get clean -y \
   && rm -rf /var/lib/apt/lists/*

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
   && unzip awscliv2.zip \
   && sudo ./aws/install

# Alias for python3
RUN echo "alias python='python3'" >> ~/.bash_aliases

# Install boto boto3
RUN pip3 install boto boto3

ENV DEBIAN_FRONTEND=dialog