module.exports = {
	production: {
		database: 'test',
		storage: 'test.sqlite',
		dialect: 'sqlite',
		seederStorage: 'sequelize',
		define: {
			timestamps: true,
			underscored: true,
			underscoredALL: true,
		},
	},
	development: {

		database: 'test',
		storage: 'test.sqlite',
		dialect: 'sqlite',
		define: {
			timestamps: true,
			underscored: true,
			underscoredALL: true,
		},
	},
};