const serverPort = process.env.PORT || 3500;
const serverFile = '/config/config.yaml';
// const serverFile = './.test/config.yaml'; //! ** TESTING **
const fs = require('fs');
const http = require('http');
const yaml = require('js-yaml');
const errorMsg = new Map([
  ['ENOTFOUND', `URL incorrect or unavailable`],
  ['DEPTH_ZERO_SELF_SIGNED_CERT', `Self-signed certificate or other SSL error`],
  [
    'ECONNREFUSED',
    'If connecting to same host, possibly a DNS issue.  Check hosts file',
  ],
]);
const tStamp = (date) => new Date(date).toLocaleString();
const guardClauseHandler = (res, code, msg) => {
  console.error(tStamp(Date.now()), msg);
  res.writeHead(code, { 'Content-Type': 'text/plain' });
  res.end(`${code}: ${http.STATUS_CODES[code]}\n${msg}`);
};

const server = http.createServer(async (req, res) => {
  const { api, services } =
    fs.existsSync(serverFile) && yaml.load(fs.readFileSync(serverFile, 'UTF8'));
  const apiKey = api?.[0].key;
  const query = new URL(req.url, `https://${req.headers.host}`).searchParams;

  if (req.method !== 'GET') {
    guardClauseHandler(res, 405, `${req.method} method not allowed, use GET`);
    return;
  }

  if (apiKey && query.get('key') !== apiKey) {
    guardClauseHandler(res, 401, `API key is set but missing`);
    return;
  }

  if (!services) {
    guardClauseHandler(
      res,
      422,
      `Config (config/config.yaml) does not exist, is formatted incorrectly, or is empty.`
    );
    return;
  }

  const results = await Promise.all(
    services.map(async (service) => {
      try {
        const response = await fetch(service.url);
        return /[2-3]0+/.test(response.status)
          ? { ...service, status: 'online' }
          : { ...service, status: 'offline' };
      } catch (error) {
        return {
          ...service,
          status: 'offline',
          error: errorMsg.get(error.cause.code) || error.cause.code,
          cause: error.cause,
        };
      }
    })
  );
  // res.setHeader('Access-Control-Allow-Origin', '*'); //! ** TESTING **
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(results));
});

server.listen(serverPort, () =>
  console.log(tStamp(Date.now()), `Server running on ${serverPort}`)
);
