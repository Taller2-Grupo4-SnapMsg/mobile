const tweets = [
  {
    id: 't0',
    user: {
      id: '1',
      username: 'taylor03',
      name: 'Taylor Smith',
      image:
        'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp',
    },
    createdAt: '2020-08-27T12:00:00.000Z',
    content: 'Can you please check if the Subscribe button on Youtube works?',
    image:
      'https://cdn.pixabay.com/photo/2018/08/19/10/16/nature-3616194_1280.jpg',
    numberOfComments: 123,
    numberOfRetweets: 11,
    numberOfLikes: 10,
  },
  {
    id: '111111111',
    createdAt: '2023-04-28T08:30:00.000Z',
    user: {
      id: '2',
      name: 'Jeff B',
      username: 'bezos',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg',
    },
    content:
      'Just had a great workout at the gym! 💪 #fitness #healthylifestyle',
    numberOfComments: 2,
    numberOfRetweets: 5,
    numberOfLikes: 25,
    impressions: 500,
  },
  {
    id: '222222222',
    createdAt: '2023-04-27T19:45:00.000Z',
    user: {
      id: '3',
      name: 'Zuck',
      username: 'zuck',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg',
    },
    content: 'Had an amazing surf session this morning',
    image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/8.jpg',
    numberOfComments: 10,
    numberOfRetweets: 20,
    numberOfLikes: 100,
    impressions: 1000,
  },
  {
    id: '222222223',
    createdAt: '2023-04-27T19:45:00.000Z',
    user: {
      id: '3',
      name: 'Zuck',
      username: 'zuck',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg',
    },
    content: 'Had an amazing surf session this morning',
    image: 'https://cdn.pixabay.com/photo/2016/11/29/13/14/full-moon-1869760_1280.jpg',
    numberOfComments: 10,
    numberOfRetweets: 20,
    numberOfLikes: 100,
    impressions: 1000,
  },
  {
    id: '111111112',
    createdAt: '2023-04-28T08:30:00.000Z',
    user: {
      id: '2',
      name: 'Jeff B',
      username: 'bezos',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg',
    },
    content:
      'Just had a great workout at the gym! 💪 #fitness #healthylifestyle',
    numberOfComments: 2,
    numberOfRetweets: 5,
    numberOfLikes: 25,
    impressions: 500,
  },
  {
    id: '111111113',
    createdAt: '2023-04-28T08:30:00.000Z',
    user: {
      id: '2',
      name: 'Jeff B',
      username: 'bezos',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg',
    },
    content:
      'Just had a great workout at the gym! 💪 #fitness #healthylifestyle',
    numberOfComments: 2,
    numberOfRetweets: 5,
    numberOfLikes: 25,
    impressions: 500,
  },
  {
    id: '111111114',
    createdAt: '2023-04-28T08:30:00.000Z',
    user: {
      id: '2',
      name: 'Jeff B',
      username: 'bezos',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg',
    },
    content:
      'Just had a great workout at the gym! 💪 #fitness #healthylifestyle',
    numberOfComments: 2,
    numberOfRetweets: 5,
    numberOfLikes: 25,
    impressions: 500,
  },
  {
    id: '333333333',
    createdAt: '2023-04-26T12:00:00.000Z',
    user: {
      id: '4',
      name: 'Jane Smith',
      username: 'janesmith',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/6.png',
    },
    content:
      'Excited to announce that I will be speaking at the upcoming tech conference in San Francisco! 🎉 #womenintech',
    numberOfComments: 5,
    numberOfRetweets: 10,
    numberOfLikes: 50,
    impressions: 1000,
  },
  {
    id: '222222224',
    createdAt: '2023-04-27T19:45:00.000Z',
    user: {
      id: '3',
      name: 'Zuck',
      username: 'zuck',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg',
    },
    content: 'Had an amazing surf session this morning',
    image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/images/8.jpg',
    numberOfComments: 10,
    numberOfRetweets: 20,
    numberOfLikes: 100,
    impressions: 1000,
  },
  {
    id: 't1',
    user: {
      id: '5',
      username: 'taylor03',
      name: 'Taylor Smith',
      image:
        'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp',
    },
    createdAt: '2020-08-27T12:00:00.000Z',
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    image:
      'https://i.insider.com/5d03aa8e6fc9201bc7002b43?width=1136&format=jpeg',
    numberOfComments: 123,
    numberOfRetweets: 11,
    numberOfLikes: 10,
  },
  {
    id: 't2',
    user: {
      id: '6',
      username: 'taylor03',
      name: 'Taylor Smith',
      image:
        'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp',
    },
    createdAt: '2020-08-27T12:00:00.000Z',
    content:
      "Hey Hey Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    numberOfComments: 4,
    numberOfRetweets: 11,
    numberOfLikes: 99,
  },
  {
    id: '222222225',
    createdAt: '2023-04-27T19:45:00.000Z',
    user: {
      id: '3',
      name: 'Zuck',
      username: 'zuck',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg',
    },
    content: 'Had an amazing surf session this morning',
    image: 'https://cdn.pixabay.com/photo/2018/08/19/10/16/nature-3616194_1280.jpg',
    numberOfComments: 10,
    numberOfRetweets: 20,
    numberOfLikes: 100,
    impressions: 1000,
  },  {
    id: '222222226',
    createdAt: '2023-04-27T19:45:00.000Z',
    user: {
      id: '3',
      name: 'Zuck',
      username: 'zuck',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg',
    },
    content: 'Had an amazing surf session this morning',
    image: 'https://cdn.pixabay.com/photo/2018/08/23/07/35/thunderstorm-3625405_1280.jpg',
    numberOfComments: 10,
    numberOfRetweets: 20,
    numberOfLikes: 100,
    impressions: 1000,
  },
  {
    id: 't3',
    user: {
      id: '7',
      username: 'taylor03',
      name: 'Taylor Smith',
      image:
        'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp',
    },
    createdAt: '2020-08-27T12:00:00.000Z',
    content: 'Hello World',
    numberOfComments: 4,
    numberOfRetweets: 11,
    numberOfLikes: 99,
  },
  {
    id: 't4',
    user: {
      id: '8',
      username: 'taylor03',
      name: 'Taylor Smith',
      image:
        'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp',
    },
    createdAt: '2020-08-27T12:00:00.000Z',
    content:
      "Hey Hey Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    numberOfComments: 4,
    numberOfRetweets: 11,
    numberOfLikes: 99,
  },
  {
    id: '111111111',
    createdAt: '2023-04-28T08:30:00.000Z',
    user: {
      id: '2',
      name: 'Jeff B',
      username: 'bezos',
      image:
        'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg',
    },
    content:
      'Just had a great workout at the gym! 💪 #fitness #healthylifestyle',
    numberOfComments: 2,
    numberOfRetweets: 5,
    numberOfLikes: 25,
    impressions: 500,
  },
];

export default tweets;
