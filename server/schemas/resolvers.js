const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        // const userData = await User.findOne({ _id: context.user._id });
        // .select('-__v -password');
        // return userData;
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const token = signToken(user);
      console.log(token);
      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      
      return { token, user };
    },

    // saveBook: async (_, { authors, description, title, bookId, image, link }, context) => {
    //   if (context.user) {
    //     const updatedUser = await User.findOneAndUpdate(
    //       { _id: context.user._id },
    //       { $addToSet: { savedBooks: { authors, description, title, bookId, image, link } } },
    //       { new: true }
    //     );
    //     return updatedUser;
    //   }
    //   throw new AuthenticationError('You need to be logged in!');
    // },

    saveBook: async (_, { bookInput }, context) => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { 
            $addToSet: { savedBooks: bookInput } ,
          },
        {
          new: true,
          runValidators: true,
        }
      );
    }
    throw new AuthenticationError('You need to be logged in!');
  },

    // removeBook: async (parent, { bookId }, context) => {
    //   if (context.user) {
    //     const updatedUser = await User.findOneAndUpdate(
    //       { _id: context.user._id },
    //       { $pull: { savedBooks: { bookId } } },
    //       { new: true }
    //     );
    //     return updatedUser;
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
