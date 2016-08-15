module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Account', {
		// appId: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: false
		// },

		// globalAccountId: {
		// 	type: DataTypes.STRING(40)
		// },

		username: {
			type: DataTypes.STRING(50),
			allowNull: false
		},

		key: {
			type: DataTypes.STRING(32),
			allowNull: false
		},

		displayName: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		familyName: {
			type: DataTypes.STRING(50)
		},
		givenName: {
			type: DataTypes.STRING(50)
		},
		middleName: {
			type: DataTypes.STRING(50)
		},
		email: {
			type: DataTypes.STRING(100),
			validate: {
				isEmail: true
			}
		},
		gender: {
			type: DataTypes.ENUM('male', 'female')
		},
		photo: {
			type: DataTypes.STRING
		},

		status: {
			type: DataTypes.ENUM('active', 'blocked', 'merged'),
			allowNull: false,
			defaultValue: 'active'
		},

		mergedWithId: {
			type: DataTypes.INTEGER
		},
		blockedAt: {
			type: DataTypes.DATE
		},
		mergedAt: {
			type: DataTypes.DATE
		},

		role: {
			type: DataTypes.STRING(50)
		},

		customData: {
			type: DataTypes.TEXT
		}

	}, {
		indexes: [{
			unique: true,
			concurrently: true,
			fields: ['appId', 'username']
		}, {
			unique: true,
			concurrently: true,
			fields: ['appId', 'email']
		}, {
			unique: true,
			concurrently: true,
			fields: ['appId', 'key']
		}]
	});
};
