const formatLog = (level, message, metadata = {}) => {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}`;
};

export const logger = {
    info: (msg, meta) => console.log(formatLog('info', msg, meta)),
    error: (msg, meta) => console.error(formatLog('error', msg, meta)),
    warn: (msg, meta) => console.warn(formatLog('warn', msg, meta))
};