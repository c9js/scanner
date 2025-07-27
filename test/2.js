const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
    const worker = new Worker(__filename);
    const dataToSend = {
        param1: 'hello',
        param2: 123,
        param3: [1, 2, 3]
    };
    worker.postMessage(dataToSend);
    
    worker.on('message', (message) => {
    console.log('Received from worker:', message);
    });
}

else {
    parentPort.on('message', (message) => {
        console.log('Received from main:', message);
        // Обработка данных
        const result = {
            received: message,
            processed: `Processed: ${message.param1}, ${message.param2}, ${message.param3.join(',')}`
        };
        parentPort.postMessage(result);
    });
}

module.exports = {
    Scanner: 1
};
