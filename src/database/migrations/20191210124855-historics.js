'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('historics', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			user_id: {
				type: Sequelize.UUID,
				references: {
					model: 'users',
					key: 'id',
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
				},
				allowNull: false
			},
			company_id: {
				type: Sequelize.UUID,
				references: {
					model: 'companies',
					key: 'id',
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				},
				allowNull: false
			},
			coupon_id: {
				type: Sequelize.UUID,
				references: {
					model: 'company_coupons',
					key: 'id',
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
				}
			},
			points: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			mode: {
				type: Sequelize.ENUM('add', 'rem'),
				allowNull: false
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('historics');
	}
};