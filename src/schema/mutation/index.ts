import { GraphQLObjectType } from 'graphql';
import { scopedMutation } from '@lib/schema';
import AuthorMutation from './Author.mutation';
import BookMutation from './Book.mutation';
import ProfileMutation from './Profile.mutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    author: scopedMutation(AuthorMutation),
    book: scopedMutation(BookMutation),
    profile: scopedMutation(ProfileMutation),
  },
});
