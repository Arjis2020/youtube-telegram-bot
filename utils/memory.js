import Stream from 'stream'
const Writable = Stream.Writable

var memStore = {};

export class MemoryWriter {
    constructor(key) {
        if (!key) throw new Error('key cannot be undefined')
        this.key = key
        memStore[this.key] = Buffer.from('')
    }
    writeChunk(chunk) {
        const _buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        memStore[this.key] = Buffer.concat([memStore[this.key], _buffer])
    }
    close() {
        delete memStore[this.key]
    }
}

export class MemoryWriterStream extends Writable {
    constructor(key) {
        super(options)
        if (!(this instanceof MemoryWriterStream)) {
            return new MemoryWriterStream(key, options);
        }
        if (!key) throw new Error('key cannot be undefined')
        this.key = key
        memStore[this.key] = Buffer.from('')
    }
    _write(chunk, enc, cb) {
        const _buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, enc)
        memStore[this.key] = Buffer.concat([memStore[this.key], _buffer])
        cb()
    }
}

export const readFromMemory = (key) => {
    return memStore[key]
}

