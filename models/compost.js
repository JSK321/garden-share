module.exports = function(sequelize, DataTypes) {
  var Compost = sequelize.define("Compost", {
    name: {
      type:DataTypes.STRING,
      allowNull: false
    },
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
      type: DataTypes.TEXT,
      allowNull: false
    },
    pictureLink: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    deposit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    withdraw: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  Compost.associate = function(models) {
    Compost.belongsTo(models.Owner, {foreignKey: {
      allowNull: false
    }, 
    onDelete: 'CASCADE'
  });
};
  return Compost;
};