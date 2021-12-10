import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreatePlayerDto } from "./dtos/create-player.dto";
import { Player } from "./interfaces/player.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  constructor(
    @InjectModel("Player") private readonly playerModel: Model<Player>
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    const findPlayer = await this.playerModel.findOne({ email }).exec();

    if (findPlayer) {
      this.update(createPlayerDto);
    } else {
      this.create(createPlayerDto);
    }

    this.create(createPlayerDto);
  }

  async consultAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async consultPlayerToEmail(email: string): Promise<Player> {
    const findPlayer = await this.playerModel.findOne({ email }).exec();
    if (!findPlayer) {
      throw new NotFoundException(`Player of this e-mail ${email} not found!`);
    }
    return findPlayer;
  }

  async deletePlayer(email): Promise<any> {
    return await this.playerModel.remove({ email }).exec();
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDto);
    return await createdPlayer.save();
  }

  private async update(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDto.email },
        { $set: createPlayerDto }
      )
      .exec();
  }
}
