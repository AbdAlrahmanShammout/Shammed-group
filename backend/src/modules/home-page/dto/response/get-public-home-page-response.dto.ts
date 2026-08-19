import { ApiProperty } from '@nestjs/swagger';

import { PublicHomePageReadModel } from '@/modules/home-page/defs/home-page-service.defs';
import { HomePageResponse } from '@/modules/home-page/dto/response/model/home-page.response';
import { PartnerResponse } from '@/modules/partner/dto/response/model/partner.response';
import { ProductResponse } from '@/modules/product/dto/response/model/product.response';
import { ServiceResponse } from '@/modules/service/dto/response/model/service.response';

export class GetPublicHomePageResponseDto {
  @ApiProperty({ type: () => HomePageResponse })
  homePage: HomePageResponse;

  @ApiProperty({ type: () => [PartnerResponse] })
  partners: PartnerResponse[];

  @ApiProperty({ type: () => [ProductResponse] })
  products: ProductResponse[];

  @ApiProperty({ type: () => [ServiceResponse] })
  services: ServiceResponse[];

  constructor(readModel: PublicHomePageReadModel) {
    this.homePage = new HomePageResponse(readModel.homePage);
    this.partners = readModel.partners.map((entity) => new PartnerResponse(entity));
    this.products = readModel.products.map((entity) => new ProductResponse(entity));
    this.services = readModel.services.map((entity) => new ServiceResponse(entity));
  }
}
