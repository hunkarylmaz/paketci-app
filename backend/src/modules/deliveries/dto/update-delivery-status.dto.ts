export class UpdateDeliveryStatusDto {
  status: string;
  courierId?: string;
  deliveryPhoto?: string;
  customerSignature?: string;
  cancellationReason?: string;
  failureReason?: string;
}
