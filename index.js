#!/usr/bin/env node

// const request = require('request-promise')
var chalk = require('chalk')
var http = require("http");
;
(() => {
    var school = process.argv[2]
    if (!school) return
    console.log(`${chalk.bgBlue('searching')} ${chalk.yellow(school)}`)
    // let r = await request(`http://data.api.gkcx.eol.cn/soudaxue/queryschool.html?messtype=jsonp&province=&schooltype=&page=1&size=9999&keyWord1=${encodeURI(school)}&schoolprop=&schoolflag=&schoolsort=&schoolid=&_=${+new Date()}`)

    var options = {
        "method": "GET",
        "hostname": "data.api.gkcx.eol.cn",
        "port": null,
        "path": "/soudaxue/queryschool.html?messtype=jsonp&province=&schooltype=&page=1&size=9999&keyWord1=" + encodeURI(school) + "&schoolprop=&schoolflag=&schoolsort=&schoolid=&_=" + (+new Date()),
        "headers": {
            "cache-control": "no-cache",
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            var r = body.toString()
            var jsonInfo = JSON.parse(r.replace(/^null\((.+?)/m, "$1").replace(/\);$/, "")).school
            if (!jsonInfo) {
                console.log(`${chalk.bgBlue('not found!')} ${chalk.yellow(school)}`)
                return
            }
            console.log(chalk.bgMagenta.bold(['schoolname', 'schooltype', 'property', '985', '211', 'schoolnature', 'membership'].join('\t')))
            jsonInfo.forEach((s) => {
                console.log(chalk.green([s.schoolname, s.schooltype, s.schoolproperty, s.f985 === '1', s.f211 === '1', s.schoolnature, s.membership].join('\t')))

            })
        });
    });

    req.end();

})()