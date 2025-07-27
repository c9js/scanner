/*▄────────────────────▄
  █                    █
  █  Загрузка модулей  █
  █                    █
  ▀────────────────────▀*/
require('core'); // Ядро
const Scanner = require('..'); // Приемник сообщений

// Создаем приемник
const _scanner = new Scanner('eth0');

// Принимаем сообщения
_scanner((message) => {
    _=message
});
