module.exports = {
  production: {
    database: 'test',
    storage: 'test.sqlite',
    dialect: 'sqlite',
    define : {
      timestamps : true, 
      underscored : true,
      underscoredALL : true,
    },
  },
  development: {
    
    dialect: 'postgres', 
    host : '192.168.99.100',
    username : 'postgres',
    password : 'docker',
    database : 'qrup',
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
