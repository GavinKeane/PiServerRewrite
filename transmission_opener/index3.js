const { execSync } = require('child_process');
const os = require('os');
username = os.userInfo().username;
wind_status = execSync("sudo /home/".concat(username,"/Documents/PiServerRewrite/check-wind.sh"), { timeout: 10000 }).toString();
console.log(`Windscribe open? ${wind_status}`)
if (wind_status.includes("DISCONNECTED")) {
  execSync("sleep 5 && /opt/windscribe/Windscribe %F &");
}
