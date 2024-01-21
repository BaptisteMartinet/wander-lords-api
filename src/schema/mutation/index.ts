import { GraphQLObjectType } from 'graphql';
import { scopedField } from '@lib/schema';
import AuthorMutation from './Author.mutation';
import BookMutation from './Book.mutation';
import ProfileMutation from './Profile.mutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    author: scopedField(AuthorMutation),
    book: scopedField(BookMutation),
    profile: scopedField(ProfileMutation),
  },
});
