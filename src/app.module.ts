import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersController } from './players/players.controller';
import { PlayersModule } from './players/players.module';
import { PlayersService } from './players/players.service';

@Module({
  imports: [PlayersModule],
  controllers: [AppController, PlayersController],
  providers: [AppService, PlayersService],
})
export class AppModule {}
