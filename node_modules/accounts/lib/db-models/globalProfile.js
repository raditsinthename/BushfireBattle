module.exports = function(sequelize, DataTypes) {
	return sequelize.define('GlobalProfile', {
		// sha1: provider + providerProfileId
		id: {
			type: DataTypes.STRING(40),
			primaryKey: true
		},
		provider: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		providerProfileId: {
			type: DataTypes.STRING,
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
		photo: {
			type: DataTypes.STRING
		},

		username: {
			type: DataTypes.STRING(50)
		},
		profileUrl: {
			type: DataTypes.STRING
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

		// globalAccountId: {
		// 	type: DataTypes.STRING(40),
		// 	allowNull: false
		// }

	});
};
