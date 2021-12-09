import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { CreatePlayerDto } from "./dtos/create-player.dto";
import { PlayersService } from "./players.service";
import { Player } from "./interfaces/player.interface";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createUpdatePlayer(createPlayerDto);
  }

  @Get()
  async consultPlayers(
    @Query("email") email: string
  ): Promise<Player[] | Player> {
    if (email) {
      return await this.playersService.consultPlayerToEmail(email);
    } else {
      return await this.playersService.consultAllPlayers();
    }
  }

  @Delete()
  async deletePlayer(@Query("email") email: string): Promise<void> {
    this.playersService.deletePlayer(email);
  }
}
