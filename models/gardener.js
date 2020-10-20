module.exports = function(sequelize, DataTypes) {
  var Gardener = sequelize.define("Gardener", {
    name: {
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
    }
  });
  Gardener.associate = function(models){
    Gardener.hasMany(models.Garden, {
      onDelete: 'SET NULL'
    })
  }
  return Gardener;
};