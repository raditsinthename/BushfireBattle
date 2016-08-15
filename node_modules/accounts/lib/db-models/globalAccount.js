module.exports = function(sequelize, DataTypes) {
	return sequelize.define('GlobalAccount', {
		// sha1: provider + providerProfileId
		id: {
			type: DataTypes.STRING(40),
			primaryKey: true
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
		photo: {
			type: DataTypes.STRING
		},
		email: {
			type: DataTypes.STRING(100),
			validate: {
				isEmail: true
			}
		},
		username: {
			type: DataTypes.STRING(50)
		},
		gender: {
			type: DataTypes.ENUM('male', 'female')
		},

		status: {
			type: DataTypes.ENUM('active', 'merged'),
			allowNull: false,
			defaultValue: 'active'
		},

		mergedWithId: {
			type: DataTypes.STRING(40)
		},

		mergedAt: {
			type: DataTypes.DATE
		}

	});
};
