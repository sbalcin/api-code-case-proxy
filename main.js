var http = require("http"), httpProxy = require("http-proxy");

var port = 1011
var target = 'https://sandbox-reporting.rpdpymnt.com'

var proxy = httpProxy.createProxyServer({});
var sendError = function (res, err) {
  // return res.status(500).send({
  //   error: err,
  //   message: "An error occured in the proxy"
  // });
};

proxy.on("error", function (err, req, res) {
  sendError(res, err);
});

var enableCors = function (req, res) {
  if (req.headers['access-control-request-method']) {
    res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
  }

  if (req.headers['access-control-request-headers']) {
    res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
  }

  if (req.headers.origin) {
    res.setHeader('access-control-allow-origin', req.headers.origin);
    res.setHeader('access-control-allow-credentials', 'true');
  }
};

proxy.on("proxyRes", function (proxyRes, req, res) {
  enableCors(req, res);
});

var server = http.createServer(function (req, res) {
  if (req.method === 'OPTIONS') {
    enableCors(req, res);
    res.writeHead(200);
    res.end();
    return;
  }

  proxy.web(req, res, {
    target: target,
    secure: true,
    changeOrigin: true
  }, function (err) {
    sendError(res, err);
  });
});

server.listen(port);
