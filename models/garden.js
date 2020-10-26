module.exports = function(sequelize, DataTypes) {
  var Garden = sequelize.define("Garden", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT
    },
    longitude: {
      type: DataTypes.FLOAT
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pictureLink: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    }
  });
  Garden.associate = function(models) {
    // add associations here
    Garden.belongsTo(models.Owner, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
    Garden.belongsTo(models.Gardener)
    Garden.hasMany(models.Request)
};
  return Garden;
};