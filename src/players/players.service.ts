import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreatePlayerDto } from "./dtos/create-player.dto";
import { Player } from "./interfaces/player.interface";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;
    const findPlayer = this.players.find((player) => player.email === email);

    if (findPlayer) {
      this.update(findPlayer, createPlayerDto);
    } else {
      this.create(createPlayerDto);
    }

    this.create(createPlayerDto);
  }

  async consultAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  async consultPlayerToEmail(email: string): Promise<Player> {
    const findPlayer = this.players.find((player) => player.email === email);
    if (!findPlayer) {
      throw new NotFoundException(`Player of this e-mail ${email} not found!`);
    }
    return findPlayer;
  }

  async deletePlayer(email): Promise<void> {
    const findePlayer = await this.players.find(
      (player) => player.email === email
    );
    this.players = this.players.filter(
      (player) => player.email !== findePlayer.email
    );
  }

  private create(createPlayerDto: CreatePlayerDto): void {
    const { name, phoneNumber, email } = createPlayerDto;

    const player: Player = {
      id: uuidv4(),
      name,
      phoneNumber,
      email,
      ranking: "A",
      rankingPosition: 1,
      photoUrl: "aaaaa",
    };
    this.logger.log(`criaJogadorDto: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private update(findPlayer: Player, createPlayerDto: CreatePlayerDto): void {
    const { name } = createPlayerDto;
    findPlayer.name = name;
  }
}
