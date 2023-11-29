# 矿池

## 安装

使用`open-ethereum-pool`作为矿池实现,比较简单的单矿工实现,矿工分账需要单独开发

    ### 构建后端
    git clone https://github.com/fedimoss/open-ethereum-pool.git
    cd open-ethereum-pool
    go build
    
    ## 启动后端
    ./open-ethereum-pool config.json
    
    ##构建前端,node使用 10.x版本
    cd www
    npm install -g ember-cli@2.9.1
    npm install -g bower
    npm install
    bower install
    
    ##把 www/config/environment.js 中修改为自己的 ApiUrl
    
    ##编译
    ./build.sh
    
    ## Nginx运行编译后的静态文件
    server {
    	listen 0.0.0.0:80;
    	root /path/to/pool/www/dist;
    	index index.html index.htm;
    
    	server_name localhost;
    
    	location /api {
    		proxy_pass http://api;
    	}
    
    	location / {
    		try_files $uri $uri/ /index.html;
    	}
    }

## 配置

`config.json`基于`config.example.json`修改即可:

```javascript
{
    "threads": 8,
    "coin": "eth",
    "name": "main",

    "proxy": {
        "enabled": true,
        "listen": "0.0.0.0:8888",
        "limitHeadersSize": 1024,
        "limitBodySize": 256,
        "behindReverseProxy": false,
        "blockRefreshInterval": "120ms",
        "stateUpdateInterval": "3s",
        "difficulty": 400,
        "hashrateExpiration": "3h",

        "healthCheck": true,
        "maxFails": 100,

        "stratum": {
            "enabled": true,
            "listen": "0.0.0.0:8008",
            "timeout": "120s",
            "maxConn": 8192
        },

        "policy": {
            "workers": 8,
            "resetInterval": "60m",
            "refreshInterval": "1m",

            "banning": {
                "enabled": false,
                "ipset": "blacklist",
                "timeout": 1800,
                "invalidPercent": 30,
                "checkThreshold": 30,
                "malformedLimit": 5
            },
            "limits": {
                "enabled": false,
                "limit": 30,
                "grace": "5m",
                "limitJump": 10
            }
        }
    },

    "api": {
        "enabled": true,
        "purgeOnly": false,
        "purgeInterval": "10m",
        "listen": "0.0.0.0:8080",
        "statsCollectInterval": "5s",
        "hashrateWindow": "30m",
        "hashrateLargeWindow": "3h",
        "luckWindow": [64, 128, 256],
        "payments": 30,
        "blocks": 50
    },

    "upstreamCheckInterval": "5s",
    "upstream": [
        {
            "name": "main",
            "url": "http://127.0.0.1:8545",
            "timeout": "10s"
        }
    ],

    "redis": {
        "endpoint": "127.0.0.1:6379",
        "poolSize": 10,
        "database": 0,
        "password": ""
    },

    "unlocker": {
        "enabled": false,
        "poolFee": 1.0,
        "poolFeeAddress": "",
        "donate": true,
        "depth": 120,
        "immatureDepth": 20,
        "keepTxFees": false,
        "interval": "10m",
        "daemon": "http://127.0.0.1:8545",
        "timeout": "10s"
    },

    "payouts": {
        "enabled": false,
        "requirePeers": 25,
        "interval": "120m",
        "daemon": "http://127.0.0.1:8545",
        "timeout": "10s",
        "address": "0x0",
        "gas": "21000",
        "gasPrice": "50000000000",
        "autoGas": true,
        "threshold": 500000000,
        "bgsave": false
    },

    "newrelicEnabled": false,
    "newrelicName": "MyEtherProxy",
    "newrelicKey": "SECRET_KEY",
    "newrelicVerbose": false
}
```

## 访问

使用浏览器访问`api.listen`, http://192.168.1.121:8080