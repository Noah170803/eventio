import { Sequelize, DataTypes } from "sequelize";
import { MY_SQL_CONNECTION_STRING } from "./env";

const sequelize = new Sequelize(MY_SQL_CONNECTION_STRING);

export const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		fullName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		createdAt: false,
		updatedAt: false,
	}
);

export interface IUser {
	id: number;
	email: string;
	password: string;
	fullName: string;
}

export const Session = sequelize.define(
	"Session",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		expiresAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		createdAt: false,
		updatedAt: false,
	}
);

export interface ISession {
	id: number;
	token: string;
	userId: number;
	expiresAt: Date;
}

User.hasMany(Session, { foreignKey: "userId" });

export const Event = sequelize.define(
	"Event",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		organizerId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		createdAt: false,
		updatedAt: false,
	}
);

export interface IEvent {
	id: number;
	title: string;
	description: string;
	organizerId: number;
	date: Date;
	location: string;
}

User.hasMany(Event, { foreignKey: "organizerId" });

export const Participant = sequelize.define(
	"Participant",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		eventId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		createdAt: false,
		updatedAt: false,
	}
);

export interface IParticipant {
	id: number;
	userId: number;
	eventId: number;
}

User.belongsToMany(Event, { through: Participant, foreignKey: "userId" });
Event.belongsToMany(User, { through: Participant, foreignKey: "eventId" });

Event.hasMany(Participant, {
	foreignKey: "eventId",
	onDelete: "CASCADE",
});

Participant.belongsTo(Event, {
	foreignKey: "eventId",
	onDelete: "CASCADE",
});
