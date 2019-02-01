import React, { Component } from 'react';
import List from './List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import * as smActions from '../actions/sm-data';
import * as showFormActions from '../actions/show-forms';
import PropTypes from 'prop-types';
import { ItemTypes } from '../services/Constants';
import { DragSource, DropTarget } from 'react-dnd';
import ListItemEditForm from './ListItemEditForm';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

const spanSource = {
  beginDrag(props) {
    return { id: props.item.id };
  }
};

const spanTarget = {
  canDrop(props, monitor) {
    // You can disallow drop based on props or item
    return true;
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

const tooltip = tip => <Tooltip id="tooltip">{tip}</Tooltip>;

const EditControls = props => {
  return (
    <div className="edit-controls-wrapper">
      {props.itemType === 'span' && (
        <OverlayTrigger placement="left" overlay={tooltip('Show drop targets')}>
          <Button bsStyle="link">
            <FontAwesomeIcon
              icon="dot-circle"
              onClick={props.handleShowDropTargetsClick}
            />
          </Button>
        </OverlayTrigger>
      )}
      <OverlayTrigger placement="top" overlay={tooltip('Edit')}>
        <Button bsStyle="link">
          <FontAwesomeIcon icon="pen" onClick={props.handleEditClick} />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="right" overlay={tooltip('Delete')}>
        <Button bsStyle="link">
          <FontAwesomeIcon icon="trash" onClick={props.handleDelete} />
        </Button>
      </OverlayTrigger>
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
      id: PropTypes.string,
      type: PropTypes.string
    })
  };

  state = {
    editing: false
  };

  handleDelete = () => {
    this.props.deleteItem(this.props.item);
  };

  handleEditClick = () => {
    /* eslint-disable */
    const { id, type } = this.props.item;
    /* eslint-enable */

    //this.props.showModal('EDIT', type, id);
    this.setState({ editing: true });
  };

  handleEditFormCancel = () => {
    this.setState({ editing: false });
  };

  handleShowDropTargetsClick = () => {
    const {
      addDropTargets,
      item,
      removeActiveDragSources,
      removeDropTargets,
      setActiveDragSource
    } = this.props;

    // Clear out any current drop targets
    removeDropTargets();

    // Handle closing of current drag source drop targets, and exit with a clean UI.
    if (item.active === true) {
      // Clear out any active drag sources
      removeActiveDragSources();
      return;
    }
    // Clear out any active drag sources
    removeActiveDragSources();

    // Calculate possible drop targets
    addDropTargets(item);

    // Redux way of setting active drag list item
    setActiveDragSource(item.id);
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
      connectDropTarget
    } = this.props;

    const subMenu = items && items.length > 0 ? <List items={items} /> : null;

    return connectDragSource(
      connectDropTarget(
        <li className={active ? 'active' : ''}>
          {this.state.editing && (
            <ListItemEditForm
              item={item}
              handleEditFormCancel={this.handleEditFormCancel}
            />
          )}

          {!this.state.editing && (
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
          )}

          {subMenu}
        </li>
      )
    );
  }
}

const mapDispatchToProps = {
  deleteItem: smActions.deleteItem,
  addDropTargets: smActions.addDropTargets,
  removeDropTargets: smActions.removeDropTargets,
  removeActiveDragSources: smActions.removeActiveDragSources,
  setActiveDragSource: smActions.setActiveDragSource,
  showModal: showFormActions.showModal
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
