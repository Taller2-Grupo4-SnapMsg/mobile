import * as React from 'react';
import { Badge, Text } from 'react-native-paper';

const NotifBadge = ({ value }) => {
  return value > 0 ? (
    <Badge
      visible={true}
      size={25}
      style={{
        backgroundColor: '#5B5A8E',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: 'white', fontSize: 14, paddingBottom: 3 }}>{value}</Text>
    </Badge>
  ) : null;
};

export default NotifBadge;
