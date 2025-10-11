const citizenUsersData = [
  {
    username: 'citizen1',
    name: 'Dinesh Perera',
    email: 'dinesh@example.com',
    password: 'Password123!',
    role: 'citizen',
    profilePicture: '/assets/profiles/citizen1.jpg',
    notificationPreferences: {
      elections: true,
      news: true,
      facts: true,
      events: true,
      promiseUpdates: true
    }
  },
  {
    username: 'citizen2',
    name: 'Malini Silva',
    email: 'malini@example.com',
    password: 'Password123!',
    role: 'citizen',
    profilePicture: '/assets/profiles/citizen2.jpg',
    notificationPreferences: {
      elections: true,
      news: false,
      facts: true,
      events: false,
      promiseUpdates: true
    }
  },
  {
    username: 'citizen3',
    name: 'Ahmed Farook',
    email: 'ahmed@example.com',
    password: 'Password123!',
    role: 'citizen',
    profilePicture: '/assets/profiles/citizen3.jpg',
    notificationPreferences: {
      elections: true,
      news: true,
      facts: true,
      events: true,
      promiseUpdates: true
    }
  },
  {
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
    role: 'citizen',
    profilePicture: '/assets/profiles/default.jpg',
    notificationPreferences: {
      elections: true,
      news: true,
      facts: true,
      events: true,
      promiseUpdates: true
    }
  }
];

// Admin user for backend access
const adminUser = {
  username: 'admin',
  name: 'Admin User',
  email: 'admin@civiclens.org',
  password: 'AdminPass123!',
  role: 'admin',
  profilePicture: '/assets/profiles/admin.jpg',
  notificationPreferences: {
    elections: true,
    news: true,
    facts: true,
    events: true,
    promiseUpdates: true
  }
};

// Politicians data (for reference, not directly accessible through the app)
const politicianUsersData = [
  {
    username: 'anura',
    name: 'Anura Kumara Dissanayake',
    email: 'anura@politician.example',
    password: 'Politician123!',
    role: 'politician',
    party: 'National People\'s Power',
    position: 'President',
    constituency: 'National',
    bio: 'Current President of Sri Lanka and leader of the JVP/NPP alliance',
    profilePicture: '/assets/profiles/anura.jpg'
  },
  {
    username: 'sajith',
    name: 'Sajith Premadasa',
    email: 'sajith@politician.example',
    password: 'Politician123!',
    role: 'politician',
    party: 'Samagi Jana Balawegaya',
    position: 'Opposition Leader',
    constituency: 'Colombo',
    bio: 'Leader of the Opposition in Sri Lanka and head of the SJB party',
    profilePicture: '/assets/profiles/sajith.jpg'
  },
  {
    username: 'ranil',
    name: 'Ranil Wickremesinghe',
    email: 'ranil@politician.example',
    password: 'Politician123!',
    role: 'politician',
    party: 'United National Party',
    position: 'Former President',
    constituency: 'National',
    bio: 'Former President and Prime Minister of Sri Lanka',
    profilePicture: '/assets/profiles/ranil.jpg'
  }
];

module.exports = { citizenUsersData, adminUser, politicianUsersData };