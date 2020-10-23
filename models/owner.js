const bcrypt = require("bcrypt");


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
    Owner.hasMany(models.Garden);
    Owner.hasMany(models.Compost);
  }
  Owner.beforeCreate(function(user){
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10),null);
})
  return Owner;
};