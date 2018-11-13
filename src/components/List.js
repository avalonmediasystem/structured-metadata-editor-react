import React from 'react';
import ListItem from './ListItem';
import PlaceholderItem from './PlaceholderItem';

const List = props => {
  return (
    <ul className="structure-list">
      {props.items.map((item, i) => {
        if (!item) {
          return null;
        }
        if (item.type === 'optional') {
          return <PlaceholderItem key={i} />
        }
        return <ListItem key={item.label} item={item} />;
      })}
    </ul>
  );
}

export default List;
