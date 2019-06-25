import { gql } from 'apollo-server';
import { getDb } from '../../db';
import { ObjectId } from 'mongodb';

export const typeDefs = gql`
  type Session {
    _id: String,
    name: String,
    votes: [Vote],
    flipped: Boolean
  }

  extend type Query {
    session(id: String): Session,
    sessions: [Session]
  }

  extend type Mutation {
    createSession(name: String): Session
  }
`;

export const resolvers = {
  Query: {
    session: async (root, { id }) => {
      return getDb().collection('sessions').findOne({ '_id': new ObjectId(id) });
    },
    sessions: async () => {
      return getDb().collection('sessions').find().toArray();
    },
  },
  Mutation: {
    createSession: async (root, { name }) => {
      const result = await getDb().collection('sessions').insertOne({ name: name, votes: [], flipped: false });
      return getDb().collection('sessions').findOne({ '_id': new ObjectId(result.insertedId) });
    },
  },
};
