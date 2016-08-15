module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AccountConnection', {
    // sha1: appId + provider + providerProfileId = for fast login
    id: {
      type: DataTypes.STRING(40),
      allowNull: false,
      primaryKey: true
    },
    // accountId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // },
    appId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    providerProfileId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // accessToken:refreshToken, or token:tokenSecret, or identifier, or... IN JSON format
    accessData: {
      type: DataTypes.TEXT
    }
  });
};
