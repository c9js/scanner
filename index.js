/*▄────────────────────▄
  █                    █
  █  Загрузка модулей  █
  █                    █
  ▀────────────────────▀*/
const { spawn } = require('child_process');

/*▄───────────────────────▄
  █                       █
  █  Принимает сообщения  █
  █                       █
  ▀───────────────────────▀*/
module.exports = function(interface) {
    _='Scanning...'
    return callback => setTimeout(() => {
        callback([interface, 'Test!']);
    }, 1000);
};
