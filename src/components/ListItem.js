import React, { Component } from 'react';
import List from './List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import * as smActions from '../actions/sm-data';
import * as showFormActions from '../actions/show-forms';
import PropTypes from 'prop-types';
import { ItemTypes } from '../services/Constants';
import { DragSource, DropTarget } from 'react-dnd';

const spanSource = {
  beginDrag(props) {
    console.log('props', props);
    return { label: props.item.label };
  }
};

const spanTarget = {
  canDrop(props, monitor) {
    // You can disallow drop based on props or item
    const item = monitor.getItem();
    return true;
  },

  hover(props, monitor, component) {
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // here—if you need them, put monitor.isOver() into collect() so you
    // can just use componentDidUpdate() to handle enter/leave.

    const draggedLabel = monitor.getItem().label;

    if (draggedLabel !== props.item.label) {
    } else {
    }

    // You will receive hover() even for items for which canDrop() is false
    const canDrop = monitor.canDrop();
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }
    console.log('dropped');

    // Obtain the dragged item
    const item = monitor.getItem();

    // You can do something with it

    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true };
  }
};

function collectDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function collectDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

const EditControls = props => {
  return (
    <div className="edit-controls-wrapper">
      {props.itemType === 'span' && (
        <FontAwesomeIcon
          icon="dot-circle"
          onClick={props.handleShowDropTargetsClick}
        />
      )}
      <FontAwesomeIcon icon="pen" onClick={props.handleEditClick} />
      <FontAwesomeIcon icon="trash" onClick={props.handleDelete} />
    </div>
  );
};

class ListItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      active: PropTypes.bool,
      begin: PropTypes.string,
      end: PropTypes.string,
      items: PropTypes.array,
      label: PropTypes.string,
      type: PropTypes.string
    })
  };

  handleDelete = () => {
    this.props.deleteItem(this.props.item);
  };

  handleEditClick = () => {
    const { label, type } = this.props.item;
    // Edit Heading
    if (type === 'div') {
      this.props.toggleHeading(true, 'EDIT', label);
    }
  };

  handleShowDropTargetsClick = () => {
    const {
      addDropTargets,
      item,
      removeActiveDragSources,
      removeDropTargets,
      setActiveDragSource,
      smData
    } = this.props;

    // Clear out any current drop targets
    removeDropTargets(smData);

    // Handle closing of current drag source drop targets, and exit with a clean UI.
    if (item.active === true) {
      // Clear out any active drag sources
      removeActiveDragSources(smData);
      return;
    }
    // Clear out any active drag sources
    removeActiveDragSources(smData);

    // Calculate possible drop targets
    addDropTargets();

    // Redux way of setting active drag list item
    setActiveDragSource(item.label);
  };

  render() {
    const {
      item,
      item: { begin },
      item: { end },
      item: { items },
      item: { label },
      item: { type },
      item: { active },
      connectDragSource,
      connectDropTarget,
      isDragging
    } = this.props;

    const subMenu = items && items.length > 0 ? <List items={items} /> : null;

    return connectDragSource(
      connectDropTarget(
        <li className={active ? 'active' : ''}>
          <div className="row-wrapper">
            {type === 'span' && (
              <span className="structure-title">
                {label} ({begin} - {end})
              </span>
            )}
            {type === 'div' && (
              <div className="structure-title heading">{label}</div>
            )}
            <EditControls
              handleDelete={this.handleDelete}
              handleEditClick={this.handleEditClick}
              itemType={type}
              handleShowDropTargetsClick={this.handleShowDropTargetsClick}
            />
          </div>
          {subMenu}
        </li>
      )
    );
  }
}

const mapDispatchToProps = {
  deleteItem: smActions.deleteItem,
  toggleHeading: showFormActions.toggleHeading,
  toggleTimespan: showFormActions.toggleTimespan,
  addDropTargets: smActions.addDropTargets,
  removeDropTargets: smActions.removeDropTargets,
  removeActiveDragSources: smActions.removeActiveDragSources,
  setActiveDragSource: smActions.setActiveDragSource
};

const mapStateToProps = state => ({
  smData: state.smData
});

const ConnectedDropTarget = DropTarget(ItemTypes.SPAN, spanTarget, collectDrop);
const ConnectedDragSource = DragSource(ItemTypes.SPAN, spanSource, collectDrag);
const DragConnected = ConnectedDropTarget(ConnectedDragSource(ListItem));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DragConnected);
