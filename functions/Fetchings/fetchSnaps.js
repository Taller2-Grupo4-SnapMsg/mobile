import React from 'react';
import getUserSnaps from '../../handlers/getUserSnaps';
export async function fetchSnaps({ user, setSnaps }) {
    try {
      const fetchedSnaps= await getUserSnaps(user.email);
      setSnaps(fetchedSnaps);
    } catch (error) {
      console.error('Error al obtener los followers:', error);
    }
};