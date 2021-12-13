import { NestFactory } from "@nestjs/core";
import momentTimezone from "moment-timezone";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-excepton.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this.toJSON())
      .tz("America/Sao_Paulo")
      .format("YYYY-MM-DD HH:mm:ss.SSS");
  };

  await app.listen(3000);
}
bootstrap();
