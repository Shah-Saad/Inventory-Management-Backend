const {Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    replication: {
        read: [
          {
            host: 'localhost',
            port: 3307, // simulated replica
            username: 'root',
            password: 'abc',
            database: 'bazaar_db'
          }
        ],
        write: {
          host: 'localhost',
          port: 3306, // main MySQL
          username: 'root',
          password: '',
          database: 'bazaar_db'
        }
      },
      pool: {
        max: 10,
        idle: 30000
      },
      logging: false
    
})

module.exports = sequelize;