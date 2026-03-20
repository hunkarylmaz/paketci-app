import { Controller, Get, Post, Patch, Param, Body, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReceiptsService } from './receipts.service';
import { ReceiptTemplate, ReceiptCustomSettings } from './entities/receipt.entity';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post(':deliveryId')
  async create(
    @Param('deliveryId') deliveryId: string,
    @Body('companyId') companyId: string,
    @Body('settings') settings?: ReceiptCustomSettings,
  ) {
    return this.receiptsService.create(deliveryId, companyId, settings);
  }

  @Get()
  async findAll(@Query('companyId') companyId: string) {
    return this.receiptsService.findAll(companyId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.receiptsService.findOne(id, companyId);
  }

  @Get(':id/html')
  async getHtml(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
    @Res() res: Response,
  ) {
    const html = await this.receiptsService.generateHtml(id, companyId);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get(':id/print')
  async printReceipt(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
    @Res() res: Response,
  ) {
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

  @Patch(':id/template')
  async updateTemplate(
    @Param('id') id: string,
    @Body('companyId') companyId: string,
    @Body('template') template: ReceiptTemplate,
    @Body('settings') settings: ReceiptCustomSettings,
  ) {
    return this.receiptsService.updateTemplate(id, companyId, template, settings);
  }
}
