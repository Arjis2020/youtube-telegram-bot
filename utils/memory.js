var memStore = {};

export class MemoryWriter {
    constructor(key) {
        if(!key) throw new Error('key cannot be undefined')
        this.key = key
        memStore[this.key] = Buffer.from('')
    }
    writeChunk(chunk) {
        const _buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        memStore[this.key] = Buffer.concat([memStore[this.key], _buffer])
    }
    close(){
        delete memStore[this.key]
    }
}

export const readFromMemory = (key) => {
    return memStore[key]
} 

