class FluentdLogger {
    constructor() {
        this.logger = require('fluent-logger');
        this.logger.configure('Apollo Graphql', {
            host: '192.168.99.100',
            port: 24224,
            timeout: 3.0,
            reconnectInterval: 120000 // 10 minutes
        });
    }

    debug(message, additionalInfo = {}) {
        this.logMessage(message, "DEBUG", additionalInfo)
    }

    info(message, additionalInfo = {}) {
        this.logMessage(message, "INFO", additionalInfo)
    }

    warning(message, additionalInfo = {}) {
        this.logMessage(message, "WARN", additionalInfo)
    }

    error(message, additionalInfo = {}) {
        this.logMessage(message, "ERROR", additionalInfo)
    }

    logMessage(message, level, additionalInfo = {}) {
        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " - "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds()

        var logMessage = {
            'log_name': 'Fluentd',
            'server': 'graphql',
            'level': level,
            'timestamp': datetime,
            'unique_id': '',
            'message': message,
            'additionalInfo': additionalInfo
        }
        this.logger.emit(level, logMessage)
    }
}

let _logger = null;

const MyLogger = () => {
    if (_logger) {
        return _logger
    } else {
        _logger = new FluentdLogger
        return _logger
    }
}

module.exports = {
    MyLogger
}
