"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrackingNumber = generateTrackingNumber;
function generateTrackingNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `PKT-${year}${month}${day}-${random}`;
}
//# sourceMappingURL=tracking-number.util.js.map