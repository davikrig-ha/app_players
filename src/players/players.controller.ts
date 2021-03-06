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
import { ValidateParameterPipe } from "src/common/pipes/validate-parameter.pipe";
import { UpdatePlayerDto } from "./dtos/update-player.dto";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto
  ): Promise<Player> {
    return await this.playersService.createdPlayer(createPlayerDto);
  }

  @Put("/:id")
  @UsePipes(ValidationPipe)
  async UpdatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param("id", ValidateParameterPipe) id: string
  ): Promise<void> {
    await this.playersService.UpdatePlayer(id, updatePlayerDto);
  }

  @Get()
  async consultPlayers(): Promise<Player[]> {
    return await this.playersService.consultAllPlayers();
  }

  @Get("/:id")
  async consultPlayersId(
    @Param("id", ValidateParameterPipe) id: string
  ): Promise<Player> {
    return await this.playersService.consultPlayerId(id);
  }

  @Delete("/:id")
  async deletePlayer(
    @Param("id", ValidateParameterPipe) id: string
  ): Promise<void> {
    this.playersService.deletePlayer(id);
  }
}
