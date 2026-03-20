"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptsController = void 0;
const common_1 = require("@nestjs/common");
const receipts_service_1 = require("./receipts.service");
const receipt_entity_1 = require("./entities/receipt.entity");
let ReceiptsController = class ReceiptsController {
    constructor(receiptsService) {
        this.receiptsService = receiptsService;
    }
    async create(deliveryId, companyId, settings) {
        return this.receiptsService.create(deliveryId, companyId, settings);
    }
    async findAll(companyId) {
        return this.receiptsService.findAll(companyId);
    }
    async findOne(id, companyId) {
        return this.receiptsService.findOne(id, companyId);
    }
    async getHtml(id, companyId, res) {
        const html = await this.receiptsService.generateHtml(id, companyId);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    async printReceipt(id, companyId, res) {
        const html = await this.receiptsService.generateHtml(id, companyId);
        await this.receiptsService.markAsPrinted(id, companyId);
        res.setHeader('Content-Type', 'text/html');
        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fiş Yazdır</title>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `);
    }
    async updateTemplate(id, companyId, template, settings) {
        return this.receiptsService.updateTemplate(id, companyId, template, settings);
    }
};
exports.ReceiptsController = ReceiptsController;
__decorate([
    (0, common_1.Post)(':deliveryId'),
    __param(0, (0, common_1.Param)('deliveryId')),
    __param(1, (0, common_1.Body)('companyId')),
    __param(2, (0, common_1.Body)('settings')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/html'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "getHtml", null);
__decorate([
    (0, common_1.Get)(':id/print'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('companyId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "printReceipt", null);
__decorate([
    (0, common_1.Patch)(':id/template'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('companyId')),
    __param(2, (0, common_1.Body)('template')),
    __param(3, (0, common_1.Body)('settings')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ReceiptsController.prototype, "updateTemplate", null);
exports.ReceiptsController = ReceiptsController = __decorate([
    (0, common_1.Controller)('receipts'),
    __metadata("design:paramtypes", [receipts_service_1.ReceiptsService])
], ReceiptsController);
//# sourceMappingURL=receipts.controller.js.map