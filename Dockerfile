# To run this, ensure your environment variables are updated and you expose
# the applicable port
# @example docker run -p 1337:1337 -i postman/postman-quality-backend-service

FROM 494522899761.dkr.ecr.us-east-1.amazonaws.com/platform/node:20

# Switch to the inbuilt app user for installation
USER app

# bundle app source
COPY --chown=app . /var/www-api

# set application environment
ENV NODE_ENV="production"

ARG POSTMAN_NPM_TOKEN

# set readonly npm token
RUN npm config set //registry.npmjs.org/:_authToken=$POSTMAN_NPM_TOKEN;

# install app dependencies along with pre and post install scripts
RUN npm install --only=production && npm rebuild;

# change user to root for uninstalling packages not needed after npm install
USER root

# remove unneeded packages after installing node modules
RUN apk del .build-deps

# change user to app
USER app

# expose applicable server port
EXPOSE 1337

ENTRYPOINT ["npm"]
CMD ["run", "docker"]
