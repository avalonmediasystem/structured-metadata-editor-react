import React from 'react';
import List from './List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditControls = props => {
  const handleDelete = () => {
    console.log('Delete it');
  }

  return (
    <div className="edit-controls-wrapper">
      <a href="/">(add {props.heading ? 'child' : 'parent'})</a>
      <FontAwesomeIcon icon="pen" />
      <FontAwesomeIcon icon="trash" onClick={handleDelete} />
    </div>
  );
};

const ListItem = props => {
  const { begin, end, items, label, type } = props.item;
  const subMenu =
    items && items.length > 0 ? <List items={items} /> : null;

  return (
    <li>
      <div className="row-wrapper">
        {type === 'span' && (
          <span className="structure-title">{label} ({begin} - {end})</span>
        )}
        {type === 'div' && (
          <div className="structure-title heading">{label}</div>
        )}
        <EditControls heading={type === 'div'} />
      </div>
      {subMenu}
    </li>
  );
};

export default ListItem;
