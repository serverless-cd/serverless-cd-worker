# https://github.com/nodejs/docker-node/blob/main/14/buster/Dockerfile
FROM node:14-buster
# 默认node版本: v14.18.2

# 参考: https://github.com/nvm-sh/nvm/blob/master/Dockerfile
#change apt-get source to aliyun
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak 
COPY debian-stretch-sources.list /etc/apt/sources.list

ENV NVM_DIR /home/node/.nvm
COPY ./nvm.sh $NVM_DIR/
RUN chown node:node -R $NVM_DIR
RUN echo 'nvm ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
USER node

RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> "$HOME/.bashrc"
# instal v12.22.12
RUN bash -c 'source $NVM_DIR/nvm.sh  && nvm install v12.22.12'
# install v16.16.0
RUN bash -c 'source $NVM_DIR/nvm.sh  && nvm install v16.16.0'

RUN bash -c 'source $NVM_DIR/nvm.sh \
  && nvm alias default system'

WORKDIR /home/node