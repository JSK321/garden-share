module.exports = function(sequelize, DataTypes) {
  var Owner = sequelize.define("Owner", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8]
      }
    },
    address: {
      type: DataTypes.STRING
    },
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT
  });
  Owner.associate = function(models){
    Owner.hasMany(models.Garden, {
      onDelete: 'CASCADE',
      hooks: true
    });
    Owner.hasMany(models.Compost, {
      onDelete: 'CASCADE',
      hooks: true
    });
  }
  return Owner;
};