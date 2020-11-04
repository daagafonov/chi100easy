"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Storage {
    constructor() {
        this.storage = [];
    }
    addItem(key, value) {
        this.storage.push({
            key,
            value,
        });
    }
    getItem(key) {
        return this.storage.filter(item => item.key === key)[0].value;
    }
}
exports.default = Storage;
//# sourceMappingURL=shared.js.map