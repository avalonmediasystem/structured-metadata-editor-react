import React from 'react';
import ListItem from './ListItem';

const List = props => {
  return (
    <ul className="structure-list">
      {props.items.map(item => {
        if (!item) {
          return null;
        }
        return <ListItem key={item.label} item={item} />;
      })}
    </ul>
  );
}

export default List;
