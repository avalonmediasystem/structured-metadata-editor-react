import React from 'react';
import List from './List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import * as smActions from '../actions/sm-data';
import * as showFormActions from '../actions/show-forms';
import PropTypes from 'prop-types';

const EditControls = props => {
  return (
    <div className="edit-controls-wrapper">
      <FontAwesomeIcon icon="pen" onClick={props.handleEditClick} />
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
    const { label, type } = item;
    // Edit Heading
    if (type === 'div') {
      props.toggleHeading(true, 'EDIT', label);
    }

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

ListItem.propTypes = {
  item: PropTypes.shape({
    begin: PropTypes.string,
    end: PropTypes.string,
    items: PropTypes.array,
    label: PropTypes.string,
    type: PropTypes.string
  })
};

const mapDispatchToProps = {
  deleteItem: smActions.deleteItem,
  toggleHeading: showFormActions.toggleHeading,
  toggleTimespan: showFormActions.toggleTimespan,

}
const mapStateToProps = state => ({
  smData: state.smData
});

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);
