/*▄────────────────────▄
  █                    █
  █  Загрузка модулей  █
  █                    █
  ▀────────────────────▀*/
const { Worker, parentPort, isMainThread } = require('worker_threads');
const L2 = require('../build/Release/l2raw');

/*▄────────────────────▄
  █                    █
  █  Создает приемник  █
  █                    █
  ▀────────────────────▀*/
if (isMainThread) module.exports = function(iface = 'eth0', delay = 0.1, delay_error = 10) {
/*┌────────────────────────────────┐
  │ Объявляем локальные переменные │
  └────────────────────────────────┘*/
    let _callbacks = []; // Коллекция обработчиков всех событий
    
/*┌──────────────────────┐
  │ Возвращает результат │
  └──────────────────────┘*/
    _result = (result, extra = {}) => {
    // Добавляем новые поля
        Object.assign(result, extra);
        
    // Выполняем коллекцию обработчиков всех событий
        _callbacks.forEach(callback => callback(result));
        
    // Возвращаем результат
        return result;
    };
    
/*┌───────────────────────────────┐
  │ Возвращает обработанный ответ │
  └───────────────────────────────┘*/
    _response = (type, res) => {
    // Создаем результат
        let result = {
            ok: false // Статус завершения
        };
        
    // Отдельный поток был уничтожен
        if (type == 'destroy') return _result(result, {
            destroy: true // Информация об уничтожении отдельного потока
        });
        
    // В отдельном потоке произошла ошибка
        if (type == 'error') return _result(result, {
            workerError: true, // Информация об отдельном потоке
            error: res.error   // Информация об ошибке
        });
        
    // Пакет не был принят
        if (res.error) return _result(result, {
            error: res.error // Информация об ошибке
        });
        
    // Пакет успешно принят
        return _result(result, {
            ok: true,      // Статус завершения
            data: res.data // Принятый пакет
        });
    };
    
/*┌─────────────────────────┐
  │ Создаем отдельный поток │
  └─────────────────────────┘*/
    const worker = new Worker(__filename);
    
/*┌─────────────────────┐
  │ Создаем обработчики │
  └─────────────────────┘*/
    worker.on('message', (res) => _response('message', res));           // Обработчик пакетов
    // worker.on('messageerror', (err) => _response('messageerror', err)); // Обработчик ошибок
    worker.on('error', (err) => _response('error', err));               // Обработчик ошибок
    
/*┌─────────────────────────────────────────┐
  │ Добавляет новый обработчик всех событий │
  └─────────────────────────────────────────┘*/
    this.on = (callback) => _callbacks.push(callback);
    
/*┌─────────────────────┐
  │ Уничтожает приемник │
  └─────────────────────┘*/
    this.destroy = () => worker.terminate().then(() => {
    // Возвращаем обработанный ответ
        _response('destroy');
        
    // Очищаем коллекцию обработчиков всех событий (сборщик мусора) 
        _callbacks = [];
        
    // Возвращаем результат
        return true;
    });
    
/*┌────────────────────┐
  │ Запускаем приемник │
  └────────────────────┘*/
    worker.postMessage({
        iface, // 
        delay: delay * 1000,
        delay_error: delay_error * 1000
    });
};

/*▄──────────────────────▄
  █                      █
  █  Запускает приемник  █
  █                      █
  ▀──────────────────────▀*/
else parentPort.on('message', async ({iface, delay, delay_error}) => {
    while (true) {
    // Создаем результат
        let res = {};
        
    // Запускаем приемник (блокирующий вызов)
        try { res.data = L2.scanner(iface).toString('hex') }
        
    // Пакет не был принят
        catch (error) { res.error = error }
        
    // Возвращаем результат
        parentPort.postMessage(res);
        
    // Создаем задержку
        await new Promise(r => setTimeout(r, res.data ? delay : delay_error));
    }
});
