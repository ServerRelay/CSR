import * as Bot from '../bot';
import { Connection } from 'jndb';
import {
	RichEmbed,
	Guild,
	TextChannel,
	Emoji,
	Collection,
	Message,
	User,
	Webhook,
} from 'discord.js';

declare class BaseChannel extends TextChannel {
	constructor(system: System, channel: TextChannel);
	public system: System;
	public client: Bot;
}
declare class PublicChannel extends BaseChannel {
	constructor(system: System, channel: TextChannel);

	public system: System;
	public csrType: string;
}

declare class PrivateChannel extends BaseChannel {
	constructor(system: System, channel: TextChannel);

	public system: System;
	public csrType: string;
	private passcode: string;

	public setPasscode(passcode: string): this;
}

declare class ChannelsManager {
	constructor(system: System);

	public system: System;
	public client: Bot;
	private db: Connection;

	public get public(): Map<string, PublicChannel>;
	public get private(): Map<string, PrivateChannel>;

	create(
		guild: Guild,
		{
			publicChannel,
			privateChannel,
		}: { publicChannel?: TextChannel; privateChannel?: TextChannel }
	): { publicChannel: PublicChannel; privateChannel: PrivateChannel };
	update(
		guild: Guild,
		channel: TextChannel,
		type: 'public' | 'private'
	): void;
	delete(guild: Guild, type: 'public' | 'private' | 'all'): this;
}

declare class BansManager {
	constructor(client: Bot);
	public client: Bot;
	private db: Connection;

	public get bans(): Map<string, BanInfo>;

	public has(id: string): boolean;
	public get(id: string): { id: string; tag: string };
	public set(user: User): this;
	public delete(id: string): this;
}
declare class WebHookManager {
	constructor(system: System);
	async fetchWebhooks(): {
		public: Map<string, Webhook>;
		private: Map<string, WebHook>;
	};
	public async send(
		webhook: Webhook,
		user: User,
		content: string | RichEmbed
	): void;
}
export = System;
declare class System {
	constructor(client: Bot);
	public client: Bot;
	private db: Connection;
	public banManager: BansManager;
	public channels: ChannelsManager;
	public webhookManager: WebHookManager;

	public sendAll(
		message: string | RichEmbed,
		{ ignoreGuilds = Array<string>() }?
	): void;
	public sendAllWebHooks(
		message: string | RichEmbed,
		user: User
	): Promise<void>;
	public findCloseServers(name: string): Array<Guild>;
	public findEmoji(name: string): Emoji;
	public findMatchingMessages(
		tag: string,
		content: string
	): Collection<string, Message>;
	public getMatchingPrivate(guild: Guild): Map<string, PrivateChannel>;
	public async obtainServer(message: Message, guilds: Array<Guild>): Guild;
	public sendPrivate(message: string | RichEmbed, guild: Guild): void;
	public getChannels(
		guild: Guild
	): { public: PublicChannel; private: PrivateChannel };
}

export declare type BanInfo = { tag: string; banned_at: string };
