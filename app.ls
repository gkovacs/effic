require! {
  express
}

app = express()

if not process.env.PORT?
  process.env.PORT = 8080

app.listen process.env.PORT, '0.0.0.0'

app.get '/', (req, res) ->
  res.send 'hello world'
