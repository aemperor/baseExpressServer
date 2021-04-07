import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class HealthCheck {
  @Field()
  status: string;
}