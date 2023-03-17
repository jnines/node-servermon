FROM alpine:latest
ENV NODE_ENV=production 
COPY / /
RUN apk add --update --no-cache nodejs npm && \
npm install --production --silent && \
  mv ep.sh /root && \
  chmod 500 /root/ep.sh
WORKDIR /app
VOLUME /config
EXPOSE 3500
CMD /root/ep.sh