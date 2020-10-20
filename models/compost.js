module.exports = function(sequelize, DataTypes) {
  var Compost = sequelize.define("Compost", {
    name: DataTypes.STRING,
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    description: {
      type: DataTypes.TEXT
    },
    pictureLink: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    deposit: DataTypes.BOOLEAN,
    withdraw: DataTypes.BOOLEAN
  });
  Compost.associate = function(models) {
    // add associations here
    Compost.belongsTo(models.Owner);
};
  return Compost;
};