function relayRequestHeaders(proxyReq, req) {
    h_val = req.headers["x-attribute-neofs-expiration-epoch"]
    delete req.headers['x-attribute-neofs-expiration-epoch'];
    
    proxyReq.setHeader('X-Attribute-NEOFS-Expiration-Epoch', h_val);

    Object.keys(req.headers).forEach(function (key) {
        proxyReq.setHeader(key, req.headers[key]);
    });
};


const PROXY_CONFIG = {
    "/chain/*": {
        "target": "http://morph_chain.neofs.devenv:30333",
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/chain": ""
        }
    },
    "/gate/upload/*": {
        "target": "http://http.neofs.devenv",
        "secure": false,
        "onProxyReq": relayRequestHeaders,
        "changeOrigin": true,
        "pathRewrite": {
            "^/gate": "http://http.neofs.devenv"
        }
    },
    "/gate/get/*": {
        "target": "http://http.neofs.devenv",
        "secure": false,
        "changeOrigin": true,
        "pathRewrite": {
            "^/gate": "http://http.neofs.devenv"
        }
    }
}

module.exports = PROXY_CONFIG;
