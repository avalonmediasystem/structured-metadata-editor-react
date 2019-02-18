import React, { Component } from 'react';
import List from './List';
import { connect } from 'react-redux';
import * as smActions from '../actions/sm-data';
import * as peaksActions from '../actions/peaks-instance';
import * as showForms from '../actions/show-forms';
import PropTypes from 'prop-types';
import { ItemTypes } from '../services/Constants';
import { DragSource, DropTarget } from 'react-dnd';
import ListItemEditForm from './ListItemEditForm';
import ListItemControls from './ListItemControls';

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

class ListItem extends Component {
  static propTypes = {
    item: PropTypes.shape({
      active: PropTypes.bool,
      begin: PropTypes.string,
      end: PropTypes.string,
      items: PropTypes.array,
      id: PropTypes.string,
      type: PropTypes.string,
      editing: PropTypes.bool
    })
  };

  state = {
    editing: false,
    clonedSegment: {}
  };

  handleDelete = () => {
    const { id } = this.props.item;
    this.props.deleteItem(id);
    this.props.deleteSegment(id);
  };

  handleEditClick = () => {
    /* eslint-disable */
    const { id, type } = this.props.item;
    /* eslint-enable */

    this.setState({
      clonedSegment: this.props.peaksInstance.segments.getSegment(id)
    });

    if (this.props.item.type === 'span') {
      this.props.activateSegment(this.props.item.id);
    }

    // Set editing flag to true within the structure
    this.props.item.editing = true;

    if (type === 'span') {
      // Get the number of items in editing status
      let itemsInEdit = this.itemsInEditStatus(this.props.smData);

      // When there are more than one items in edit status,
      if (itemsInEdit > 1) {
        this.props.handleListEditing(0); // Trigger an alert and block List component
        this.props.item.editing = false; // Set editing to false of the current item
      }
      // Set editing to true when there is only one item in edit status
      if (itemsInEdit === 1) {
        this.setState({ editing: true });
        this.props.activateSegment(this.props.item.id);
      }
    } else {
      this.setState({ editing: true });
    }
  };

  handleEditFormCancel = (flag = 'cancel') => {
    this.setState({ editing: false });

    // Change segment colors in the waveform
    if (this.props.item.type === 'span') {
      this.props.deactivateSegment(this.props.item.id);
      if (flag === 'cancel') {
        this.props.revertSegment(this.props.item.id, this.state.clonedSegment);
      }
    }

    this.props.item.editing = false;
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

  /**
   * Check for number of items in the structure with editing flag set to true
   */
  itemsInEditStatus = smData => {
    let count = 0;
    let getStatus = items => {
      for (let item of items) {
        if (item.editing && item.type === 'span') {
          count++;
        }
        if (item.items) {
          getStatus(item.items);
        }
      }
    };
    getStatus(smData);
    return count;
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
              <ListItemControls
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
  deleteSegment: peaksActions.deleteSegment,
  revertSegment: peaksActions.revertSegment,
  activateSegment: peaksActions.activateSegment,
  deactivateSegment: peaksActions.deactivateSegment,
  handleListEditing: showForms.handleListEditing
};

const mapStateToProps = state => ({
  smData: state.smData,
  peaksInstance: state.peaksInstance
});

const ConnectedDropTarget = DropTarget(ItemTypes.SPAN, spanTarget, collectDrop);
const ConnectedDragSource = DragSource(ItemTypes.SPAN, spanSource, collectDrag);
const DragConnected = ConnectedDropTarget(ConnectedDragSource(ListItem));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DragConnected);
