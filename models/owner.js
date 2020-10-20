module.exports = function(sequelize, DataTypes) {
  var Owner = sequelize.define("Owner", {
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
  Owner.associate = function(models){
    Owner.hasMany(models.Garden, {
      onDelete: 'CASCADE'
    });
    Owner.hasMany(models.Compost, {
      onDelete: 'CASCADE'
    });
  }
  return Owner;
};