module.exports = function(sequelize, DataTypes) {
  return sequelize.define('App', {
    key: {
      type: DataTypes.STRING(32)
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    uname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },

    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    }

  });
};
