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
exports.MapsController = void 0;
const common_1 = require("@nestjs/common");
const maps_service_1 = require("./maps.service");
let MapsController = class MapsController {
    constructor(mapsService) {
        this.mapsService = mapsService;
    }
    async calculateRoute(body) {
        return this.mapsService.calculateRoute(body.origin, body.destination, body.waypoints);
    }
    async calculateOptimizedRoute(body) {
        return this.mapsService.calculateOptimizedRoute(body.waypoints);
    }
    async geocodeAddress(address) {
        return this.mapsService.geocodeAddress(address);
    }
    async reverseGeocode(lat, lng) {
        return this.mapsService.reverseGeocode(parseFloat(lat), parseFloat(lng));
    }
    getTileServers() {
        return {
            servers: this.mapsService.getTileServers(),
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        };
    }
    async calculateDistanceMatrix(body) {
        return this.mapsService.calculateDistanceMatrix(body.origins, body.destinations);
    }
    decodePolyline(body) {
        return {
            coordinates: this.mapsService.decodePolyline(body.encoded),
        };
    }
};
exports.MapsController = MapsController;
__decorate([
    (0, common_1.Post)('route'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "calculateRoute", null);
__decorate([
    (0, common_1.Post)('route/optimized'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "calculateOptimizedRoute", null);
__decorate([
    (0, common_1.Get)('geocode'),
    __param(0, (0, common_1.Query)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "geocodeAddress", null);
__decorate([
    (0, common_1.Get)('reverse-geocode'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "reverseGeocode", null);
__decorate([
    (0, common_1.Get)('tiles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MapsController.prototype, "getTileServers", null);
__decorate([
    (0, common_1.Post)('distance-matrix'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MapsController.prototype, "calculateDistanceMatrix", null);
__decorate([
    (0, common_1.Post)('polyline/decode'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], MapsController.prototype, "decodePolyline", null);
exports.MapsController = MapsController = __decorate([
    (0, common_1.Controller)('maps'),
    __metadata("design:paramtypes", [maps_service_1.MapsService])
], MapsController);
//# sourceMappingURL=maps.controller.js.map