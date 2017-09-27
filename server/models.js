const { Schema } = require('mongoose')

const UserSchema = Schema({
  slug: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
    unique: true
  },
  hotp: {
    counter: {
      type: Number,
      default: 1
    },
    secret: {
      type: String
    }
  },
  telegram: {
    userId: {
      type: Number,
      index: true,
      unique: true
    },
    username: {
      type: String,
      lowercase: true,
      trim: true,
      index: true
    },
    chatId: {
      type: Number,
      index: true,
      unique: true
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    }
  },
  ethereum: {
    address: {
      type: String,
      lowercase: true,
      trim: true,
      index: true
    },
    encryptedSeed: {
      type: String,
      trim: true
    },
    encryptedPrivateKey: {
      type: String,
      trim: true
    },
    otp: {
      type: Number,
      default: null
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

UserSchema.static('findByUsername', function (username, callback) {
  return this.findOne({ 'telegram.username': username }, callback)
})

UserSchema.static('findBySlug', function (slug, callback) {
  return this.findOne({ slug: slug }, callback)
})

UserSchema.virtual('telegramFullName').get(function () {
  const name = []

  if (this.telegram.firstName) name.push(this.telegram.firstName)
  if (this.telegram.lastName) name.push(this.telegram.lastName)

  if (name.length === 0) return this.telegram.username
  else return name.join(' ')
})

const schemas = {
  User: UserSchema
}

module.exports = (connection, cb) => {
  const models = {}

  Object.keys(schemas).map((schema) => {
    models[schema] = connection.model(schema, schemas[schema])
  })

  cb(null, models)
}
