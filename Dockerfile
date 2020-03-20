FROM node:10.15-slim

ENV NODE_SOURCE /usr/src/

WORKDIR $NODE_SOURCE

COPY . $NODE_SOURCE

RUN buildDeps=' \
        gcc \
	make \
	python \
	' \
        && apt-get update \
	&& apt-get install -y libhiredis-dev node-gyp\
        && apt-get install -y $buildDeps --no-install-recommends \
        && rm -rf /var/lib/apt/lists/* \
	&& yarn install

EXPOSE 8899
CMD ["yarn", "start"]