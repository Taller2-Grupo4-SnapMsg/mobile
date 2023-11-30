import React from 'react';
import getUserSnaps from '../../handlers/getUserSnaps';
export async function fetchSnaps({ user, setSnaps, navigation }) {
    try {
      const fetchedSnaps= await getUserSnaps(user.email, navigation);
      setSnaps(fetchedSnaps);
    } catch (error) {
      console.error('Error al obtener los followers:', error);
    }
};