import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, DatePicker } from 'antd';

function renderCheckbox(column, query, onCheckChange) {
  return column && column.property && column.checkbox ?
    <Checkbox
      indeterminate={typeof query[column.property] === 'undefined'}
      name={column.property}
      checked={query[column.property] || false}
      onChange={onCheckChange}
    /> :
    '';
}

function renderDate(column, query, onMinDateChange, onMaxDateChange) {
  const queryVal = query[column.property] || {};
  return column && column.property && (column.type === 'date') ? (
    <div>
      <div>
        <DatePicker
          size="small"
          placeholder="From date"
          style={{ width: '100%' }}
          value={queryVal.min}
          onChange={date => onMinDateChange(column.property, date)}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <DatePicker
          size="small"
          placeholder="To date"
          style={{ width: '100%' }}
          value={queryVal.max}
          onChange={date => onMaxDateChange(column.property, date)}
        />
      </div>
    </div>
    ) :
    '';
}

function renderNumber(column, query, onMinNumberChange, onMaxNumberChange) {
  const queryVal = query[column.property] || {};
  return column && column.property && (column.type === 'number') ? (
    <div>
      <div>
        <input
          type="number"
          className="column-filter-input"
          name={column.property}
          value={queryVal.min || ''}
          onChange={onMinNumberChange}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          type="number"
          className="column-filter-input"
          name={column.property}
          value={queryVal.max || ''}
          onChange={onMaxNumberChange}
        />
      </div>
    </div>
    ) :
    '';
}

function renderText(column, query, onQueryChange) {
  return column && column.property && !column.checkbox && (column.type !== 'date') && (column.type !== 'number') ?
    <input
      onChange={onQueryChange}
      className="column-filter-input"
      name={column.property}
      placeholder={column.filterPlaceholder || ''}
      value={query[column.property] || ''}
    /> :
    '';
}

const SearchColumns = ({ columns, query, onChange }) => {
  const onQueryChange = (event) => {
    onChange({
      ...query,
      [event.target.name]: event.target.value
    });
  };

  const onCheckChange = (event) => {
    onChange({
      ...query,
      [event.target.name]: ((query[event.target.name] === false) && event.target.checked) ?
      undefined :
      event.target.checked
    });
  };

  const onMinDateChange = (name, date) => {
    const dateFilter = query[name] || {};
    dateFilter.min = date;
    onChange({
      ...query,
      [name]: dateFilter
    });
  };

  const onMaxDateChange = (name, date) => {
    const dateFilter = query[name] || {};
    dateFilter.max = date;
    onChange({
      ...query,
      [name]: dateFilter
    });
  };

  const onMinNumberChange = (event) => {
    const { name, value } = event.target;
    const rangeFilter = query[name] || {};
    rangeFilter.min = value;
    onChange({
      ...query,
      [name]: rangeFilter
    });
  };

  const onMaxNumberChange = (event) => {
    const { name, value } = event.target;
    const rangeFilter = query[name] || {};
    rangeFilter.max = value;
    onChange({
      ...query,
      [name]: rangeFilter
    });
  };

  return (
    <tr>
      {columns.map((column, i) => (
        <th key={`${column.property || i}-column-filter`} className="column-filter">
          {renderCheckbox(column, query, onCheckChange)}
          {renderDate(column, query, onMinDateChange, onMaxDateChange)}
          {renderNumber(column, query, onMinNumberChange, onMaxNumberChange)}
          {renderText(column, query, onQueryChange)}
        </th>
      ))}
    </tr>
  );
};

SearchColumns.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  query: PropTypes.object
};

SearchColumns.defaultProps = {
  query: {}
};

export default SearchColumns;
