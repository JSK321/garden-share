module.exports = function (sequelize, DataTypes) {
  var Request = sequelize.define("Request", {
  });
  Request.associate = function (models) {
    Request.belongsTo(models.Garden, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
    Request.belongsTo(models.Gardener, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };
  return Request;
};