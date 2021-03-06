module.exports = {
  production: {
    database: 'test',
    storage: 'production.sqlite',
    dialect: 'sqlite',
    seederStorage: 'sequelize',
    define: {
      timestamps: true,
      underscored: true,
      underscoredALL: true
    }
  },
  test: {
    database: 'test',
    storage: 'test.sqlite',
    dialect: 'sqlite',
    define: {
      timestamps: true,
      underscored: true,
      underscoredALL: true
    }
  },
  development: {
    database: 'test',
    storage: 'development.sqlite',
    dialect: 'sqlite',
    define: {
      timestamps: true,
      underscored: true,
      underscoredALL: true
    }
  }
}
