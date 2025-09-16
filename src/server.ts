import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

// GET, POST, PUT, PATCH, DELETE

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*')
  console.log('Calling server: ' + tables);

  return tables
})

app

  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTPP Server Running!')
  })
