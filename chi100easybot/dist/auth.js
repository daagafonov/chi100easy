"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = __importDefault(require("src/shared"));
class AuthStorage extends shared_1.default {
    set auth(value) {
        this.addItem('auth', value);
    }
    get auth() {
        return this.getItem('auth');
    }
}
exports.default = AuthStorage;
//# sourceMappingURL=auth.js.map