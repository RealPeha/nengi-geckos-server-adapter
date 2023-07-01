import { IServerNetworkAdapter, User, InstanceNetwork } from "nengi";
import { BufferReader, BufferWriter } from "nengi-buffers";
import { ServerChannel } from "@geckos.io/server";
import geckos from "@geckos.io/server";
import type { ServerOptions } from "@geckos.io/common/lib/types.js";

declare module "nengi" {
  interface User {
    channel: ServerChannel;
  }
}

export class GeckosServerAdapter implements IServerNetworkAdapter {
  network: InstanceNetwork;
  geckosOptions?: ServerOptions;

  constructor(network: InstanceNetwork, geckosOptions?: ServerOptions) {
    this.network = network;
    this.geckosOptions = geckosOptions;
  }

  listen(port: number, ready?: () => void) {
    const io = geckos(this.geckosOptions);

    io.onConnection((channel) => {
      const user = new User(channel, this);
      user.channel = channel;

      this.network.onOpen(user);

      channel.onRaw((message: any) => {
        this.network.onMessage(user, Buffer.from(message));
      });

      channel.onDisconnect(() => {
        this.network.onClose(user);
      });
    });

    io.listen(port);

    ready?.();
  }

  disconnect(user: User): void {
    user.channel.close();
  }

  send(user: User, buffer: Buffer): void {
    user.channel.raw.emit(buffer);
  }

  createBuffer(lengthInBytes: number) {
    return Buffer.allocUnsafe(lengthInBytes);
  }

  createBufferWriter(lengthInBytes: number) {
    return new BufferWriter(this.createBuffer(lengthInBytes));
  }

  createBufferReader(buffer: Buffer) {
    return new BufferReader(buffer);
  }
}
