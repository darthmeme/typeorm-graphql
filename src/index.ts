import 'reflect-metadata'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import path from 'path'
import cors from 'cors'
import { createConnection } from 'typeorm'
import { importSchema } from 'graphql-import'
import { makeExecutableSchema } from 'graphql-tools'
import Book from './entities/Book'

// Start the app
import Author from './entities/Author'
;(async () => {
  await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'password',
    database: 'test',
    entities: [path.resolve(__dirname, './entities/*.ts')],
    synchronize: true,
    logging: false,
  })

  const typeDefs = importSchema(path.resolve(__dirname, './schema/main.gql'))
  const resolvers = {
    Query: {
      test: () => {
        return 'Hello, World!'
      },
      books: async () => {
        const books = await Book.find({
          relations: ['authors'],
        })

        return books
      },
    },
    Mutation: {
      addBook: async (_: any, args: Partial<Book>) => {
        const book = Book.create({
          authors: [],
          ...args,
        })

        await book.save()

        return book
      },
      addAuthor: async (_: any, args: Partial<Author>) => {
        const author = Author.create({
          books: [],
          ...args,
        })

        await author.save()

        return author
      },
      // @ts-ignore
      editBook: async (_: any, args: any) => {
        const book = await Book.findOne(args.input.id)

        if (!book) {
          throw new Error('Book not found')
        }

        if (args.input.authorIds) {
          const authors = await Author.findByIds(args.input.authorIds)

          book.authors = [...(book.authors || []), ...authors]
        }

        await book.save()

        return book
      },
    },
  }

  const app = express()

  app.use(cors())

  app.use(
    '/graphql',
    graphqlHTTP({
      schema: makeExecutableSchema({ typeDefs, resolvers }),
    })
  )

  app.get('/ping', (req, res) => {
    res.send('pong')
  })

  app.listen(8080, () => {
    console.log('App listening on port 8080')
  })
})()
