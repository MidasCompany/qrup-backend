module.exports = {
  production: {
    dialect: 'postgres', 
    host : '192.168.99.100',
    username : 'postgres',
    password : 'docker',
    database : 'qrup',
    define : {
      timestamps : true,
      underscored : true,
      underscoredALL : true,
    },
  },
  development: {
    database: 'test',
    storage: 'test.sqlite',
    dialect: 'sqlite',
    dialectOptions: {
      dateString: true,
      typeCast: true
    },
    define: {
      timestamps: true,
      underscored : true,
      underscoredALL : true,
    },
    logging: false
  }
};