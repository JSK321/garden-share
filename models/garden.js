module.exports = function(sequelize, DataTypes) {
  var Garden = sequelize.define("Garden", {
    name: DataTypes.STRING,
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
      type: DataTypes.TEXT
    },
    length: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
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