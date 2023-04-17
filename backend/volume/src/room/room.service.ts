import { PrismaRoomService } from './prisma/prismaRoom.service';
import { Injectable } from '@nestjs/common';
import { Access, Status } from '@prisma/client';

export interface roomDto {
  name: string;
  ownerId: number;
  access: Access;
}

function exclude<Room, Key extends keyof Room>(
  room: Room,
  keys: Key[]
): Omit<Room, Key> {
  for (const key of keys) {
    delete room[key];
  }
  return room;
}

@Injectable()
export class RoomService {
  constructor(
    private prismaRoom: PrismaRoomService,
  ) {}

  //  creates a new chatroom
  async createChat(roomData: roomDto) {
    try {
      this.prismaRoom.createRoom(roomData);
    } catch (e) {
      console.error(e);
    }
  }

  // adds user to the chatroom
  // need to add uban to this too? FUTURE feature
  async addToChat(userId: number, roomId: number) {
    try {
      this.prismaRoom.updateRoom({
        where: {
          id: roomId,
        },
        data: {
          users: {
            connect: {
              id: userId,
            }
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  // fetches all users of this chatroom
  async getRoomUsers(roomId: number){
    const roomAndUsers = await this.prismaRoom.RoomWithUsers({id: roomId});
    return(roomAndUsers.users);
  }

  async getRoomAdmins(roomId: number){
    const roomAndUsers = await this.prismaRoom.roomWithAdmins({id: roomId});
    return(roomAndUsers.users);
  }

  async getRoomById(roomId: number) {
    const room = await this.prismaRoom.Room({id: roomId});
    const roomWithoutPasscode = exclude(room, ['hashedCode']);
    return roomWithoutPasscode;
  }

  async removeChat(roomId: number) {
    this.prismaRoom.deleteRoom({id: roomId});
  }

  async makeAdmin(roomId: number, userId: number) {
    this.prismaRoom.updateRoom({
      where: {
        id: roomId,
      },
      data: {
        admin: {
          connect: {
            id: userId,
          }
        }
      }
    });
  }

  async getPublicRooms() {
    return (this.prismaRoom.Rooms({
      where: {
        access: Access.PUBLIC,
      }
    }));
  }

  async removeAdmin(roomId: number, userId: number) {
    this.prismaRoom.updateRoom({
      where: {
        id: roomId,
      },
      data: {
        admin: {
          disconnect: {
            id: userId,
          }
        }
      }
    });
  }

  async banUser(roomId: number, userId: number) {
    this.prismaRoom.updateRoom({
      where: {
        id: roomId,
      },
      data: {
        banMute: {
          create: {
            userId: userId,
            status: Status.BANNED,
            timestamp: new Date(Date.now() + 45000), // 45sec
          }
        }
      }
    });
  }

  async muteUser(roomId: number, userId: number) {
    this.prismaRoom.updateRoom({
      where: {
        id: roomId,
      },
      data: {
        banMute: {
          create: {
            userId: userId,
            status: Status.MUTED,
            timestamp: new Date(Date.now() + 45000), // 45sec
          }
        }
      }
    });
  }

}
