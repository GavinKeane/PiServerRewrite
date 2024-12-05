const express = require('express');
const ffs = require('fast-folder-size');
const cron = require('node-cron');
const { execSync } = require('child_process');
const app = express();

username = os.userInfo().username;
localIPGlobal = '';

//Landing
app.get('/', (request, response) => {
    const cachePath = '/var/lib/plexmediaserver/Library/Application Support/Plex Media Server/Cache';
    const hdd = '/media/gavin/storage';
    //disk.check(hdd, (err, info) => {
      ffs(cachePath, (err, size) => {
        if (err) {
          console.error(err);
        }
        comm = execSync("bash /home/".concat(username, "/Documents/PiServerRewrite/check-wind.sh && bash /home/",username,"/Documents/PiServerRewrite/check-trans.sh"), { timeout: 15000 }).toString();
        wind = '';
        trans = '';
        if (comm.includes("CONNECTED") && !comm.includes("DISCONNECTED")) {
          wind = 'progress-good';
        } else {
          wind = 'progress-bad';
        }
        if (comm.includes("tyes")) {
          trans = 'progress-good';
        } else if (comm.includes("tno")) {
          trans = 'progress-bad';
        }
        text = header.concat('<body> \
        ', generateNavbar(), ' \
        <div class="home-info"> \
        <div class="progress-container"> \
        <div class="progress-wrapper"> \
        <p class="progress-text">Plex Cache: ', formatBytes(size), ' / ', formatBytes(maxCacheSize), '</p> \
        <progress value="', ((size / maxCacheSize) * 100).toFixed(0), '" max="100"></progress> \
        </div></div> \
        <div class="progress-container"> \
        <div class="progress-wrapper"> \
        </div></div> \
        <div class="progress-container"> \
        <div class="progress-wrapper"> \
        <p class="progress-text">Windscribe</p> \
        <progress class="', wind, '" value="100" max="100"></progress> \
        </div></div> \
        <div class="progress-container last"> \
        <div class="progress-wrapper"> \
        <p class="progress-text">Transmission</p> \
        <progress class="', trans, '" value="100" max="100"></progress> \
        </div></div> \
        </div> \
  <div><button class=\"reboot-button\" id=\"reboot\">Reboot Pi</button></div> \
  </body>');

  //text = text.concat('<p class="countdown">', countdown('2025-06-14'), "</p>")

        buttonScript = "<script>$(document).ready(function () { \
    $(\"#reboot\").click(function () \
    { if(confirm(\"Are you sure you want to reboot?\")){ \
      \$.post(\"/reboot\", {  }, \
        function (data, status) {console.log(data);})} \
        })});</script>";
        text = text.replace("[SCRIPTHERE]", buttonScript);
        text = text.concat(footer);
        response.send(text);
      });
    //});
  });

  function generateNavbar() {
    navbar = '';
    pirateLinkClass = '';
    pirateLink = '';
    comm = execSync("bash /home/".concat(username,"/Documents/PiServerRewrite/check-wind.sh && bash /home/",username,"/Documents/PiServerRewrite/check-trans.sh"), { timeout: 15000 }).toString();
    if (comm.includes("CONNECTED") && !comm.includes("DISCONNECTED")) {
      pirateLinkClass = 'active-link';
      pirateLink = pirateLink.concat("http://", localIPGlobal , ":3000/search/");
    } else {
      pirateLinkClass = 'inactive-link';
      pirateLink = "#";
    }
    navbar = navbar.concat("\
      <nav> \
        <img class=\"cabbage-logo\" src=\"/images/cabbage\" alt=\"Cabbage Connect Logo\"> \
        <a href=\"http://", localIPGlobal , ":3000\">Home</a> \
        <a href=\"http://", localIPGlobal , ":3000/files/\">File Explorer</a> \
        <a class=\"", pirateLinkClass, "\" href=\"", pirateLink, "\">Pirate Search</a> \
        <a href=\"http://", localIPGlobal , ":3000/transmission/\">Transmission</a> \
        <a href=\"http://app.plex.tv\" target=\"_blank\">Plex Portal</a> \
      </nav> \
    ");
    //<a href=\"http://", localIPGlobal , ":3000/plex/\">Plex Portal</a> \
    return navbar;
  }

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

cron.schedule('0 5 * * 1', () => {
    const { execSync } = require('child_process');
    execSync("sudo apt update");
    execSync("sudo apt upgrade -y");
    execSync("sudo apt autoremove -y");
    execSync("sudo apt autoclean -y");
    execSync("sudo reboot");
  });