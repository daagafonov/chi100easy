var Storage = /** @class */ (function () {
    function Storage() {
        this.storage = [];
    }
    Storage.prototype.addItem = function (key, value) {
        this.storage.push({
            key: key,
            value: value,
        });
    };
    return Storage;
}());
export default Storage;
//# sourceMappingURL=shared.js.map