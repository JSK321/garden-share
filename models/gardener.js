const bcrypt = require("bcrypt");


module.exports = function(sequelize, DataTypes) {
  var Gardener = sequelize.define("Gardener", {
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
  Gardener.associate = function(models){
    Gardener.hasMany(models.Garden, {
      onDelete: 'SET NULL'
    })
  }
  Gardener.beforeCreate(function(user){
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10),null);
})
  return Gardener;
};