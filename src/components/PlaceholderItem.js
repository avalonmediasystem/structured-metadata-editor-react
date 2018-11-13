import React, {Component} from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../services/Constants';

const styles = {
  li: {
    border: '2px #999 dashed',
    opacity: .3
  },
  liHovered: {
    border: '5px #999 dashed',
    opacity: .5
  }
};

const optionalTarget = {
  hover(props, monitor, component) {
    console.log('hover');
  },

  drop(props, monitor, component) {
    console.log('drop');
  }
}

function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  }
}

class PlaceholderItem extends Component {
  render() {
    const { isOver, canDrop, connectDropTarget } = this.props;

    return connectDropTarget(
      <li className="row-wrapper" style={isOver ? styles.liHovered : styles.li}>
        Drop here
      </li>
    );
  }
}

export default DropTarget(ItemTypes.SPAN, optionalTarget, collect)(PlaceholderItem);
