"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const integrations_controller_1 = require("./integrations.controller");
const webhook_controller_1 = require("./webhook.controller");
const integrations_service_1 = require("./integrations.service");
const integration_entity_1 = require("./entities/integration.entity");
const webhook_event_entity_1 = require("./entities/webhook-event.entity");
const yemeksepeti_adapter_1 = require("./adapters/yemeksepeti.adapter");
const migrosyemek_adapter_1 = require("./adapters/migrosyemek.adapter");
const trendyolyemek_adapter_1 = require("./adapters/trendyolyemek.adapter");
const getiryemek_adapter_1 = require("./adapters/getiryemek.adapter");
let IntegrationsModule = class IntegrationsModule {
};
exports.IntegrationsModule = IntegrationsModule;
exports.IntegrationsModule = IntegrationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([integration_entity_1.Integration, webhook_event_entity_1.WebhookEvent]),
        ],
        controllers: [integrations_controller_1.IntegrationsController, webhook_controller_1.WebhookController],
        providers: [
            integrations_service_1.IntegrationsService,
            yemeksepeti_adapter_1.YemeksepetiAdapter,
            migrosyemek_adapter_1.MigrosYemekAdapter,
            trendyolyemek_adapter_1.TrendyolYemekAdapter,
            getiryemek_adapter_1.GetirYemekAdapter,
        ],
        exports: [integrations_service_1.IntegrationsService],
    })
], IntegrationsModule);
//# sourceMappingURL=integrations.module.js.map