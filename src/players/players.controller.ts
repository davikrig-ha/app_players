import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreatePlayerDto } from "./dtos/create-player.dto";
import { PlayersService } from "./players.service";
import { Player } from "./interfaces/player.interface";
import { PlayersValidationPipe } from "./pipes/players-validation.pipe";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<Player>{
   return await this.playersService.createdPlayer(createPlayerDto);
  }

  @Put("/:id")
  @UsePipes(ValidationPipe)
  async UpdatePlayer(
    @Body() createPlayerDto: CreatePlayerDto,
    @Param("id", PlayersValidationPipe) id: string
  ): Promise<void> {
    await this.playersService.UpdatePlayer(id, createPlayerDto);
  }

  @Get()
  async consultPlayers(): Promise<Player[]> {
    return await this.playersService.consultAllPlayers();
  }

  @Get("/:id")
  async consultPlayersId(
    @Param("id", PlayersValidationPipe) id: string
  ): Promise<Player> {
    return await this.playersService.consultPlayerId(id);
  }

  @Delete("/:id")
  async deletePlayer(
    @Param("id", PlayersValidationPipe) id: string
  ): Promise<void> {
    this.playersService.deletePlayer(id);
  }
}
