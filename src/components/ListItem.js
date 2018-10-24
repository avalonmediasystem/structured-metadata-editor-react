import React from 'react';
import List from './List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import * as actions from '../actions/sm-data';

const EditControls = props => {
  return (
    <div className="edit-controls-wrapper">
      <FontAwesomeIcon icon="pen" />
      <FontAwesomeIcon icon="trash" onClick={props.handleDelete} />
    </div>
  );
};

const ListItem = props => {
  const {
    item,
    item: { begin },
    item: { end },
    item: { items },
    item: { label },
    item: { type }
  } = props;
  const subMenu = items && items.length > 0 ? <List items={items} /> : null;

  const handleDelete = () => {
    props.deleteItem(item);
  };

  const handleEditClick = () => {
    
  }

  return (
    <li>
      <div className="row-wrapper">
        {type === 'span' && (
          <span className="structure-title">
            {label} ({begin} - {end})
          </span>
        )}
        {type === 'div' && (
          <div className="structure-title heading">{label}</div>
        )}
        <EditControls handleDelete={handleDelete} handleEditClick={handleEditClick} />
      </div>
      {subMenu}
    </li>
  );
};

const mapStateToProps = state => ({
  smData: state.smData
});

export default connect(mapStateToProps, actions)(ListItem);
