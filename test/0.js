/*▄────────────────────▄
  █                    █
  █  Загрузка модулей  █
  █                    █
  ▀────────────────────▀*/
require('core'); // Ядро
const {Scanner, Sender} = require('..'); // Работа с RAW-пакетами на уровне L2

/*▄────────────▄
  █            █
  █  Приемник  █
  █            █
  ▀────────────▀*/
// Создаем приемник
const _scanner = new Scanner('eth0', 0.1, 3);

// Добавляем обработчик всех событий
_scanner.on((res) => {
    _=res
});

setTimeout(async () => {
    _=await _scanner.destroy();
}, 5000);

if (0) {
/*▄──────────────▄
  █              █
  █  Передатчик  █
  █              █
  ▀──────────────▀*/
// Создаем передатчик
const _sender = new Sender('eth0');

// Добавляем обработчик всех событий
_sender.on((res) => {
    _=res
});

// Передаем пакет раз в 1 секунду
(async () => {
    while (true) {
        _=await _sender('FFFFFFFFFFFF0123456789000001');
        await new Promise(r => setTimeout(r, 3000));
    }
})();
}