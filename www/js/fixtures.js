var fixtureItems = [{
    item: {
      id: 1,
      image: "../img/items/tuba.jpg",
      name: "Tuba",
      price: 5,
      type: 'product'
    },
    points: 10
  },
  {
    item: {
      id: 2,
      image: "../img/items/french_horn.jpg",
      name: "French horn",
      price: 6,
      type: 'product'
    },
    points: 7
  },
  {
    item: {
      id: 3,
      image: "../img/items/sax.jpg",
      name: "Saxophone",
      price: 7,
      type: 'product'
    },
    points: 6
  }
  // {
  //   item: {
  //     id: 4,
  //     image: "img/items/trombone.jpg",
  //     name: "Trombone",
  //     price: 8,
  //     type: 'product'
  //   }
  // },
  // {
  //   id: 5,
  //   image: "img/items/trumpet.jpg",
  //   name: "Trumpet",
  //   price: 9,
  //   type: 'product'
  // },
  // {
  //   id: 6,
  //   image: "img/items/flugelhorn.jpg",
  //   name: "Flugelhorn",
  //   price: 10,
  //   type: 'product'
  // },
  // {
  //   id: 7,
  //   image: "img/items/repair.jpg",
  //   name: "Brass repairs",
  //   price: 11,
  //   type: 'service'
  // },
  ];

  var fixtureItem = {
      id: 7,
      image: "img/items/repair.jpg",
      name: "Brass repairs",
      price: 11,
      period: 3,
      type: 'service',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.',
      requests: [{from_user_id:1, description:"I would love to use this this weekend!", date:"2014-05-30T20:56:19.435Z"},{from_user_id:2, description:"I would love to use this this weekend!", date:"2014-02-30T20:56:19.435Z"},{from_user_id:2, description:"I would love to use this this weekend!", date:"2014-04-30T20:56:19.435Z"}]

    };


var fixtureUsers = [{
      neighbor: {
        id: 1,
        avatar: "../img/users/1.jpg",
        name: "Carey Johnson",
        username: "Carey J.",
        neighborhood: "Queen Anne",
        years: "3.5"
      },
      points: 14
    },
    {
      neighbor: {
        id: 2,
        avatar: "../img/users/2.jpg",
        name: "PK Brown horn"
      },
      points: 8
    },
    {
      neighbor: {
        id: 3,
        avatar: "../img/users/3.jpg",
        name: "Alex Carter"
      },
      points: 7
    }
    // {
    //   id: 4,
    //   image: "img/users/4.jpg",
    //   name: "Tomas Gaborik",
    // },
    // {
    //   id: 5,
    //   image: "img/users/5.jpg",
    //   name: "Max Kopitar",
    // },
    // {
    //   id: 6,
    //   image: "img/users/6.jpg",
    //   name: "David Toffoli",
    // },
    // {
    //   id: 7,
    //   image: "img/users/7.jpg",
    //   name: "Brandon Quick",
    // },
  ];

var fixtureRequests = [{
    id: 1,
    from_user_id: 1,
    user_image: "img/users/1.jpg",
    title: "Power Washer Needed.",
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 2,
    from_user_id: 2,
    user_image: "img/users/2.jpg",
    title: "Power Washer Needed.",
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 3,
    from_user_id: 3,
    user_image: "img/users/3.jpg",
    title: "Power Washer Needed.",
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 4,
    from_user_id: 4,
    user_image: "img/users/4.jpg",
    title: "Power Washer Needed.",
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 5,
    from_user_id: 5,
    user_image: "img/users/5.jpg",
    title: "Power Washer Needed.",
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 6,
    from_user_id: 6,
    user_image: "img/users/6.jpg",
    title: "Power Washer Needed.",
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 7,
    from_user_id: 7,
    user_image: "img/users/7.jpg",
    title: "Power Washer Needed.",
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  }
];
var fixtureSingleRequest = {
    id: 1,
    from_user_id: 1,
    type: 'product',
    activity: 'offer',
    image: "img/items/tuba.jpg",
    title: "Power Washer",
    price: 7,
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  };


var fixtureRequests2 = [{
    id: 1,
    from_user_id: 1,
    type: 'product',
    activity: 'offer',
    image: "img/items/tuba.jpg",
    title: "Power Washer.",
    price: 7,
    item_of_the_week: 'May 19th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 2,
    from_user_id: 2,
    type: 'product',
    activity: 'offer',
    image: "img/items/french_horn.jpg",
    title: "Power Washer.",
    price: 7,
    item_of_the_week: 'May 12th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 3,
    from_user_id: 3,
    type: 'product',
    activity: 'request',
    image: "img/items/sax.jpg",
    title: "Power Washer.",
    price: 7,
    item_of_the_week: 'May 5th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 4,
    from_user_id: 4,
    type: 'product',
    activity: 'request',
    image: "img/items/trombone.jpg",
    title: "Power Washer.",
    price: 7,
    item_of_the_week: 'April 28th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 5,
    from_user_id: 5,
    type: 'product',
    activity: 'request',
    image: "img/items/trumpet.jpg",
    title: "Power Washer.",
    price: 7,
    item_of_the_week: 'April 21st, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 6,
    from_user_id: 6,
    type: 'product',
    activity: 'request',
    image: "img/items/flugelhorn.jpg",
    title: "Power Washer.",
    price: 7,
    item_of_the_week: 'April 14th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 7,
    from_user_id: 7,
    type: 'service',
    activity: 'request',
    image: "img/items/repair.jpg",
    title: "Power Washer.",
    price: 7,
    item_of_the_week: 'April 7th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  }
];
var fixtureInbox = [{
      id: '537bec09bd831e60956e51dc',
      borrower: { 
        id: '537bec09bd831e60956e51da',
        firstName: 'Brendan',
        lastName: 'Benzing',
        avatar: 'http://s3-us-west-2.amazonaws.com/s2g-images/b1/53a3a020c39df608007722a8.jpg',
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
      },
      lender: { 
        id: '53a1ca18b5e1a8080005bc68',
        firstName: 'Patty',
        lastName: 'O\'Hara',
        avatar: 'http://s3-us-west-2.amazonaws.com/s2g-images/b1/53a48229e5295c09005b9007.jpg',
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
       },
      neighborhood: '537bec09bd831e60956e51da',
      dateRequested: '2014-04-22T00:09:50.821Z',
      item: { 
        id: '53a4fbfccb25aa0a00226ba8',
        lender: '53a1ca18b5e1a8080005bc68',
        neighborhood: '537bec09bd831e60956e51da',
        name: 'Chainsaw',
        description: '24" chainsaw...',
        image: 'http://www.picturesnew.com/media/images/chainsaw-image.jpg',
        dateCreated: '2014-04-22T00:09:50.821Z',
        type: 'product',
        rate: 10.50,
        unit: 'day',
        charity_contrib: {
        rate: 25,
        type: 'master'
      },
      lastUpdated: '2014-04-22T00:09:50.821Z',
      tags: ['gas powered', 'chainsaw'],
      categories: ['Yard Tools'] },
      text: 'Dude, can I use your chainsaw?',
      type: 'borrow-request',
      response: 'accept',
      dateResponded: '2014-04-22T00:54:50.821Z',
      borrowerMessages: 3,
      lenderMessages: 1
    },
    {
      id: '537bec09bd831e60956e51dc',
      lender: { 
        id: '537bec09bd831e60956e51da',
        firstName: 'Brendan',
        lastName: 'Benzing',
        avatar: 'http://s3-us-west-2.amazonaws.com/s2g-images/b1/53a3a020c39df608007722a8.jpg',
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
      },
      borrower: { 
        id: '53a1ca18b5e1a8080005bc68',
        firstName: 'Patty',
        lastName: 'O\'Hara',
        avatar: 'http://s3-us-west-2.amazonaws.com/s2g-images/b1/53a48229e5295c09005b9007.jpg',
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
       },
      neighborhood: '537bec09bd831e60956e51da',
      dateRequested: '2014-04-22T00:09:50.821Z',
      item: { 
        id: '53a4fbfccb25aa0a00226ba8',
        lender: '53a1ca18b5e1a8080005bc68',
        neighborhood: '537bec09bd831e60956e51da',
        name: '30 foot rope',
        description: '24" chainsaw...',
        image: 'http://www.picturesnew.com/media/images/chainsaw-image.jpg',
        dateCreated: '2014-04-22T00:09:50.821Z',
        type: 'product',
        rate: 10.50,
        unit: 'day',
        charity_contrib: {
        rate: 25,
        type: 'master'
      },
      lastUpdated: '2014-04-22T00:09:50.821Z',
      tags: ['gas powered', 'chainsaw'],
      categories: ['Yard Tools'] },
      text: 'Dude, can I use your chainsaw?',
      type: 'borrow-request',
      response: 'accept',
      dateResponded: '2014-04-22T00:54:50.821Z',
      borrowerMessages: 1,
      lenderMessages: 0
    },{
      id: '537bec09bd831e60956e51dc',
      lender: { 
        id: '537bec09bd831e60956e51da',
        firstName: 'Brendan',
        lastName: 'Benzing',
        avatar: 'http://s3-us-west-2.amazonaws.com/s2g-images/b1/53a3a020c39df608007722a8.jpg',
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
      },
      borrower: { 
        id: '53a1ca18b5e1a8080005bc68',
        firstName: 'Patty',
        lastName: 'O\'Hara',
        avatar: 'http://s3-us-west-2.amazonaws.com/s2g-images/b1/53a48229e5295c09005b9007.jpg',
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
       },
      neighborhood: '537bec09bd831e60956e51da',
      dateRequested: '2014-04-22T00:09:50.821Z',
      item: { 
        id: '53a4fbfccb25aa0a00226ba8',
        lender: '53a1ca18b5e1a8080005bc68',
        neighborhood: '537bec09bd831e60956e51da',
        name: '30 foot rope',
        description: '24" chainsaw...',
        image: 'http://www.picturesnew.com/media/images/chainsaw-image.jpg',
        dateCreated: '2014-04-22T00:09:50.821Z',
        type: 'product',
        rate: 10.50,
        unit: 'day',
        charity_contrib: {
        rate: 25,
        type: 'master'
      },
      lastUpdated: '2014-04-22T00:09:50.821Z',
      tags: ['gas powered', 'chainsaw'],
      categories: ['Yard Tools'] },
      text: 'Dude, can I use your chainsaw?',
      type: 'borrow-request',
      response: 'accept',
      dateResponded: '2014-04-22T00:54:50.821Z',
      borrowerMessages: 1,
      lenderMessages: 3
    },
    {
      id: '537bec09bd831e60956e51aa',
      borrower: { 
        id: '537bec09bd831e60956e51da',
        firstName: 'Brendan',
        lastName: 'Benzing',
        avatar: 'http://s3-us-west-2.amazonaws.com/s2g-images/b1/53a3a020c39df608007722a8.jpg',
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
      },
      lender: { 
        id: '53a1ca18b5e1a8080005bc68',
        firstName: 'Patty',
        lastName: 'O\'Hara',
        avatar: 'http://s3-us-west-2.amazonaws.com/s2g-images/b1/53a48229e5295c09005b9007.jpg',
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
       },
      neighborhood: '537bec09bd831e60956e51da',
      dateRequested: '2014-04-22T00:09:50.821Z',
      shoutout: { 
        id: '537bec09bd831e60956e51dc',
        borrower: '537bec09bd831e60956e51d6',
        neighborhood: '537bec09bd831e60956e51da',
        dateRequested: '2014-04-22T00:09:50.821Z',
        title: 'Chainsaw, vroom, vroom',
        description: 'Dude, anyone have a chainsaw?',
        type: 'product',
        dateCreated: '2014-04-22T00:09:50.821Z',
        image: 'http://.../chainsaw.jpg',
        rate: '$10/hour',
        duration: 'A few hours',
        startDate: '2014-05-22T00:09:50.821Z',
        endDate: '2014-05-22T00:09:50.821Z',
        tags: ['chainsaw', 'trees'],
        categories: ['Power Tools'],
        lastUpdated: '2014-04-22T00:09:50.821Z' 
      },
      text: 'Dude, you want to borrow my chainsaw?',
      type: 'borrow-request',
      dateResponded: '2014-04-22T00:54:50.821Z',
      borrowerMessages: 3,
      lenderMessages: 1
    },
    {
      id: '537bec09bd831e60956e51aa',
      lender: { 
        id: '53a8b1ccec452a0a00fd6596',
        firstName: 'Patty',
        lastName: 'King',
        avatar: 'http://s3-us-west-2.amazonaws.com/s2g-images/b1/53bdad06f4a65208005d302d.jpg',
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
      },
      borrower: { 
        id: '53a1ca18b5e1a8080005bc68',
        firstName: 'Patty',
        lastName: 'O\'Hara',
        avatar: 'http://s3-us-west-2.amazonaws.com/s2g-images/b1/53a48229e5295c09005b9007.jpg',
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
       },
      neighborhood: '537bec09bd831e60956e51da',
      dateRequested: '2014-04-22T00:09:50.821Z',
      shoutout: { 
        id: '537bec09bd831e60956e51dc',
        borrower: '53a8b1ccec452a0a00fd6596',
        neighborhood: '537bec09bd831e60956e51da',
        dateRequested: '2014-04-22T00:09:50.821Z',
        title: 'Really tall ladder',
        description: 'I need to paint my tall house',
        type: 'product',
        dateCreated: '2014-04-22T00:09:50.821Z',
        image: 'http://.../chainsaw.jpg',
        rate: '$10/hour',
        duration: 'A few hours',
        startDate: '2014-05-22T00:09:50.821Z',
        endDate: '2014-05-22T00:09:50.821Z',
        tags: ['chainsaw', 'trees'],
        categories: ['Power Tools'],
        lastUpdated: '2014-04-22T00:09:50.821Z' 
      },
      text: 'Dude, you want to borrow my chainsaw?',
      type: 'borrow-request',
      dateResponded: '2014-04-22T00:54:50.821Z',
      borrowerMessages: 3,
      lenderMessages: 1
    },{
      id: '537bec09bd831e60956e51aa',
      lender: { 
        id: '53a8b1ccec452a0a00fd6596',
        firstName: 'Patty noAvatar',
        lastName: 'King',
        avatar: null,
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
      },
      borrower: { 
        id: '53a1ca18b5e1a8080005bc68',
        firstName: 'Patty',
        lastName: 'O\'Hara',
        avatar: 'http://s3-us-west-2.amazonaws.com/s2g-images/b1/53a48229e5295c09005b9007.jpg',
        neighborhoodSince: '2014-04-22T00:09:50.821Z'
       },
      neighborhood: '537bec09bd831e60956e51da',
      dateRequested: '2014-04-22T00:09:50.821Z',
      shoutout: { 
        id: '537bec09bd831e60956e51dc',
        borrower: '53a8b1ccec452a0a00fd6596',
        neighborhood: '537bec09bd831e60956e51da',
        dateRequested: '2014-04-22T00:09:50.821Z',
        title: 'Really tall ladder',
        description: 'I need to paint my tall house',
        type: 'product',
        dateCreated: '2014-04-22T00:09:50.821Z',
        image: 'http://.../chainsaw.jpg',
        rate: '$10/hour',
        duration: 'A few hours',
        startDate: '2014-05-22T00:09:50.821Z',
        endDate: '2014-05-22T00:09:50.821Z',
        tags: ['chainsaw', 'trees'],
        categories: ['Power Tools'],
        lastUpdated: '2014-04-22T00:09:50.821Z' 
      },
      text: 'Dude, you want to borrow my chainsaw?',
      type: 'borrow-request',
      dateResponded: '2014-04-22T00:54:50.821Z',
      borrowerMessages: 3,
      lenderMessages: 1
    }];


var fixtureRequest2 = {
    id: 1,
    from_user_id: 1,
    type: 'product',
    activity: 'offer',
    image: "img/items/tuba.jpg",
    title: "Power Washer Needed.",
    price: 7,
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  };

var fixtureActivityItems = [{
    id: 1,
    from_user_id: 1,
    type: 'product',
    activity: 'offer',
    image: "img/items/tuba.jpg",
    user_image: "img/users/1.jpg",
    title: "Accepted",
    subtitle: "Power Washer Needed.",
    price: 7,
    item_of_the_week: 'May 19th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 2,
    from_user_id: 2,
    type: 'product',
    activity: 'offer',
    image: "img/items/french_horn.jpg",
    user_image: "img/users/2.jpg",
    title: "Request",
    subtitle: "Need a Handyman.",
    price: 7,
    item_of_the_week: 'May 12th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 3,
    from_user_id: 3,
    type: 'product',
    activity: 'request',
    image: "img/items/sax.jpg",
    user_image: "img/users/3.jpg",
    title: "Request",
    subtitle: "Cabinet Maker",
    price: 7,
    item_of_the_week: 'May 5th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 4,
    from_user_id: 4,
    type: 'product',
    activity: 'request',
    image: "img/items/trombone.jpg",
    user_image: "img/users/4.jpg",
    title: "Power Washer.",
    subtitle: "Lawn Mower.",
    price: 7,
    item_of_the_week: 'April 28th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 5,
    from_user_id: 5,
    type: 'product',
    activity: 'request',
    image: "img/items/trumpet.jpg",
    user_image: "img/users/5.jpg",
    title: "Power Washer.",
    subtitle: "Power Washer.",
    price: 7,
    item_of_the_week: 'April 21st, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 6,
    from_user_id: 6,
    type: 'product',
    activity: 'request',
    image: "img/items/flugelhorn.jpg",
    user_image: "img/users/6.jpg",
    title: "Power Washer.",
    subtitle: "Power Washer.",
    price: 7,
    item_of_the_week: 'April 14th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  },
  {
    id: 7,
    from_user_id: 7,
    type: 'service',
    activity: 'request',
    image: "img/items/repair.jpg",
    user_image: "img/users/7.jpg",
    title: "Power Washer.",
    subtitle: "Power Washer.",
    price: 7,
    item_of_the_week: 'April 7th, 2014',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.'
  }
];
