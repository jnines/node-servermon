# Node ServerMon

A very (very) quickly written nodejs API/docker image to return server/service status in JSON format. Used for [MyTab](https://github.com/jnines/MyTab). If for whatever reason you decide to use this, know you may have to play with [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

## Usage

### Docker CLI

```text
docker run -d \
--name=nodeservermon \
-e PUID=1000 \
-e PGID=1000 \
-e TZ=Etc/UTC \
-e SELFSIGNEDCERT=''
-p 3500:3500 \
-v /path/to/config:/config \
--restart unless-stopped \
ghcr.io/jnines/node-servermon:latest
```

### Docker Compose

```yaml
services:
  nodeservermon:
    container_name: nodeservermon
    image: ghcr.io/jnines/node-servermon
    environment:
      NODE_ENV: production
      PUID: 1000
      PGID: 1000
      TZ: Etc/UTC
      SELFSIGNEDCERT: # Optional
    ports:
      - 3500:3500
    volumes:
      - /path/to/config:/config
    restart: unless-stopped
```

### Values

```yaml
PUID: 1000 # User ID for volume permissions
PGID: 1000 # Group ID for volume permissions
TZ: Etc/UTC # Timezone of container
SELFSIGNEDCERT: # Optional. Use if you are connecting to server with self-signed certificate
ports:
  - 3500:3500 # External:Internal port. Only change external to fit your needs
Volumes:
  - ...:/config # Where on local machine /config directory is mapped
```

## Configuration and return

Configuration is done through config/config.yaml. An optional API key can be set, if for whatever reason it's warranted.

```yaml
- name: google
  url: https://google.com
  fa_icon: fa-brands fa-google
```

Returns

```json
[
  {
    "name": "google",
    "fa_icon": "fa-brands fa-google",
    "url": "https://google.com",
    "status": "online"
  }
]
```

If you choose to use an API key...

```yaml
api:
  # Optional: in quotation marks if using
  - key: 'abcdef123456'
```

The request should look like...

```text
SERVERURL:PORT?key=abcdef123456
```
