var execSync = require("child_process").execSync
var axios = require("axios")
var fs = require("fs-extra")
execSync("gcloud auth print-access-token> token.txt")

var token = fs.readFileSync("token.txt", "utf8")


