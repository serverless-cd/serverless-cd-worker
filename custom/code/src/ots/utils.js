const { Long } = require('tablestore');

function objectToString(value) {
  if (typeof value === 'object') {
    const protoName = Object.getPrototypeOf(value).constructor.name;
    if (protoName === 'Object' || protoName === 'Array') {
      try {
        return JSON.stringify(value);
      } catch (e) {
        console.warn(e);
      }
    }
  }
  return value;
}

function stringToNested(value) {
  if (typeof value === 'string' && /(^\[.*\]$)|(^\{.*\}$)/.test(value)) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn(e);
    }
  }
  return value;
}

function valueToLong(value) {
  if (typeof value === 'number' && value % 1 === 0) {
    return Long.fromNumber(value);
  }
  return value;
}

function nullToString(value) {
  return value === null ? 'null' : value;
}

function longToValue(value) {
  if (typeof value === 'object' && Object.getPrototypeOf(value).constructor.name === 'Int64') {
    return value.toNumber();
  }
  if (value === 'null') {
    return null;
  }
  return value;
}

const wrapAttributes = (attributes = {}) => {
  const attributeColumns = [];
  const newAttributes = [];
  for (const key in attributes) {
    const ele = attributes[key];
    if (ele || ele === false) {
      newAttributes.push(key);
    }
  }
  newAttributes.forEach((field) => {
    let value = nullToString(attributes[field]);
    value = objectToString(value);
    value = valueToLong(value);
    attributeColumns.push({ [field]: value });
  });
  return attributeColumns;
};

const wrapRow = (rowData) => {
  let { primaryKey, attributes } = rowData;
  primaryKey = primaryKey || [];
  attributes = attributes || [];
  const data = {};
  primaryKey.forEach((col) => {
    data[col.name] = longToValue(stringToNested(col.value));
  });
  attributes.forEach((col) => {
    data[col.columnName] = longToValue(stringToNested(col.columnValue));
  });
  return data;
};

const wrapRows = (rows = []) => {
  return rows.map(wrapRow);
};

module.exports = {
  wrapAttributes,
  wrapRows,
  wrapRow,
};
