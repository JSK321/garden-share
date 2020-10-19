module.exports = function(sequelize, DataTypes) {
    var _TableName_ = sequelize.define("_tableName_", {
      columnName1: DataTypes._DATATYPE_,
      columnName2: DataTypes._DATATYPE_
    });
    return _TableName_;
  };
  