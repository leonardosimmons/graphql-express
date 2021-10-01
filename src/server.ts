if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { ApolloServer } from "apollo-server";
import { context } from "./context";
import { schema } from "../graphql/schema";

const server = new ApolloServer({
  schema: schema,
  context: context,
});

server.listen().then(async ({ url }) => {
  console.log(`\
🚀 Server ready at: ${url}
  `);
});
