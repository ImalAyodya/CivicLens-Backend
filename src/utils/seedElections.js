const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Election = require('../models/Election');

// Configure env variables
dotenv.config();

// Sample past election data
const pastElectionData = [
  {
    title: '2020 Presidential Election',
    description: '2020 Sri Lankan presidential election',
    year: 2020,
    type: 'presidential',
    date: new Date('2020-11-16'),
    status: 'completed',
    winningCandidate: 'Gotabaya Rajapaksa',
    winningParty: 'Sri Lanka Podujana Peramuna',
    turnoutPercentage: 83.7,
    totalVotes: 13387490,
    candidates: [
      {
        name: 'Gotabaya Rajapaksa',
        party: 'SLPP',
        votes: 6924255,
        votingPercentage: 52.25,
        color: '#E51C23',
        isWinner: true,
        bio: 'Former defense secretary who led the military campaign to end the civil war',
        manifesto: 'Focus on national security, economic development, and protecting Sri Lankan culture'
      },
      {
        name: 'Sajith Premadasa',
        party: 'NDF',
        votes: 5564239,
        votingPercentage: 41.99,
        color: '#4CAF50',
        isWinner: false,
        bio: 'Former housing minister known for his housing development projects',
        manifesto: 'Social welfare programs, job creation, and stronger democratic institutions'
      },
      {
        name: 'Anura K. Dissanayaka',
        party: 'JVP',
        votes: 445958,
        votingPercentage: 3.16,
        color: '#FF9800',
        isWinner: false,
        bio: 'Leader of the Janatha Vimukthi Peramuna, advocating for left-wing policies',
        manifesto: 'Anti-corruption measures, state-controlled economy, and education reforms'
      }
    ],
    regions: [
      {
        name: 'Western Province',
        voterTurnout: 84.2,
        registeredVoters: 3415356,
        results: [
          { candidateName: 'Gotabaya Rajapaksa', partyName: 'SLPP', votes: 1637766, percentage: 49.3 },
          { candidateName: 'Sajith Premadasa', partyName: 'NDF', votes: 1530752, percentage: 46.1 },
          { candidateName: 'Others', partyName: 'Various', votes: 150989, percentage: 4.6 }
        ]
      },
      {
        name: 'Southern Province',
        voterTurnout: 86.7,
        registeredVoters: 1815241,
        results: [
          { candidateName: 'Gotabaya Rajapaksa', partyName: 'SLPP', votes: 1142202, percentage: 65.4 },
          { candidateName: 'Sajith Premadasa', partyName: 'NDF', votes: 553677, percentage: 31.7 },
          { candidateName: 'Others', partyName: 'Various', votes: 50826, percentage: 2.9 }
        ]
      },
      {
        name: 'Northern Province',
        voterTurnout: 71.3,
        registeredVoters: 943888,
        results: [
          { candidateName: 'Sajith Premadasa', partyName: 'NDF', votes: 562968, percentage: 83.9 },
          { candidateName: 'Gotabaya Rajapaksa', partyName: 'SLPP', votes: 79673, percentage: 11.9 },
          { candidateName: 'Others', partyName: 'Various', votes: 28317, percentage: 4.2 }
        ]
      }
    ],
    turnoutTrend: [
      { year: 2010, percentage: 74.5 },
      { year: 2015, percentage: 81.5 },
      { year: 2020, percentage: 83.7 }
    ],
    facts: [
      {
        content: 'This election was held during the COVID-19 pandemic with strict health protocols in place.',
        category: 'general'
      },
      {
        content: 'The 2020 election saw the highest voter turnout in Sri Lankan history at 83.7%.',
        category: 'general'
      },
      {
        content: 'Gotabaya Rajapaksa became the first military officer to be elected as President of Sri Lanka.',
        category: 'general'
      }
    ],
    electionFact: 'The 2020 election was conducted during the COVID-19 pandemic with special health measures in place, yet still achieved a record voter turnout of 83.7%.'
  },
  {
    title: '2015 Presidential Election',
    description: '2015 Sri Lankan presidential election',
    year: 2015,
    type: 'presidential',
    date: new Date('2015-01-08'),
    status: 'completed',
    winningCandidate: 'Maithripala Sirisena',
    winningParty: 'New Democratic Front',
    turnoutPercentage: 81.5,
    totalVotes: 12264377,
    candidates: [
      {
        name: 'Maithripala Sirisena',
        party: 'NDF',
        votes: 6217162,
        votingPercentage: 51.28,
        color: '#4CAF50',
        isWinner: true,
        bio: 'Former health minister who defected from the ruling party to challenge President Rajapaksa',
        manifesto: 'Constitutional reforms to reduce presidential powers and combat corruption'
      },
      {
        name: 'Mahinda Rajapaksa',
        party: 'UPFA',
        votes: 5768090,
        votingPercentage: 47.58,
        color: '#E51C23',
        isWinner: false,
        bio: 'Incumbent president seeking a third term, credited with ending the civil war',
        manifesto: 'Continued infrastructure development and strengthening national security'
      },
      {
        name: 'Other Candidates',
        party: 'Various',
        votes: 138201,
        votingPercentage: 1.14,
        color: '#9E9E9E',
        isWinner: false
      }
    ],
    regions: [
      {
        name: 'Western Province',
        voterTurnout: 81.8,
        registeredVoters: 3315356,
        results: [
          { candidateName: 'Maithripala Sirisena', partyName: 'NDF', votes: 1792148, percentage: 55.8 },
          { candidateName: 'Mahinda Rajapaksa', partyName: 'UPFA', votes: 1358215, percentage: 42.3 },
          { candidateName: 'Others', partyName: 'Various', votes: 61380, percentage: 1.9 }
        ]
      },
      {
        name: 'Central Province',
        voterTurnout: 82.4,
        registeredVoters: 1685201,
        results: [
          { candidateName: 'Maithripala Sirisena', partyName: 'NDF', votes: 971924, percentage: 55.6 },
          { candidateName: 'Mahinda Rajapaksa', partyName: 'UPFA', votes: 756895, percentage: 43.3 },
          { candidateName: 'Others', partyName: 'Various', votes: 19562, percentage: 1.1 }
        ]
      }
    ],
    turnoutTrend: [
      { year: 2005, percentage: 73.7 },
      { year: 2010, percentage: 74.5 },
      { year: 2015, percentage: 81.5 }
    ],
    facts: [
      {
        content: 'The 2015 election saw a surprise victory by Maithripala Sirisena who was a former minister under Mahinda Rajapaksa.',
        category: 'general'
      },
      {
        content: 'This election marked the first time an incumbent president was defeated in Sri Lankan history.',
        category: 'general'
      },
      {
        content: 'The 2015 election was called two years before the term of the incumbent president was due to expire.',
        category: 'general'
      }
    ],
    electionFact: 'The 2015 election resulted in a surprising victory for Maithripala Sirisena, marking the first time in Sri Lankan history that an incumbent president was defeated.'
  },
  {
    title: '2010 Presidential Election',
    description: '2010 Sri Lankan presidential election',
    year: 2010,
    type: 'presidential',
    date: new Date('2010-01-26'),
    status: 'completed',
    winningCandidate: 'Mahinda Rajapaksa',
    winningParty: 'United People\'s Freedom Alliance',
    turnoutPercentage: 74.5,
    totalVotes: 10495451,
    candidates: [
      {
        name: 'Mahinda Rajapaksa',
        party: 'UPFA',
        votes: 6015934,
        votingPercentage: 57.88,
        color: '#E51C23',
        isWinner: true,
        bio: 'Incumbent president who led the country during the final phase of the civil war',
        manifesto: 'Post-war reconstruction and economic development'
      },
      {
        name: 'Sarath Fonseka',
        party: 'NDF',
        votes: 4173185,
        votingPercentage: 40.15,
        color: '#4CAF50',
        isWinner: false,
        bio: 'Former army commander who led military operations during the final phase of the civil war',
        manifesto: 'Democratic reforms and anti-corruption measures'
      },
      {
        name: 'Other Candidates',
        party: 'Various',
        votes: 204138,
        votingPercentage: 1.97,
        color: '#9E9E9E',
        isWinner: false
      }
    ],
    turnoutTrend: [
      { year: 2005, percentage: 73.7 },
      { year: 2010, percentage: 74.5 }
    ],
    facts: [
      {
        content: 'This election was held soon after the end of the civil war, with security and post-war reconstruction as key issues.',
        category: 'general'
      },
      {
        content: 'The two main candidates, Mahinda Rajapaksa and Sarath Fonseka, had worked together to end the civil war but became political rivals.',
        category: 'general'
      },
      {
        content: 'This was the first presidential election to be held in a united Sri Lanka after the end of the civil war.',
        category: 'general'
      }
    ],
    electionFact: 'The 2010 election was the first presidential election held after the end of the 26-year civil war, with post-war reconstruction as a major campaign issue.'
  },
  {
    title: '2005 Presidential Election',
    description: '2005 Sri Lankan presidential election',
    year: 2005,
    type: 'presidential',
    date: new Date('2005-11-17'),
    status: 'completed',
    winningCandidate: 'Mahinda Rajapaksa',
    winningParty: 'United People\'s Freedom Alliance',
    turnoutPercentage: 73.7,
    totalVotes: 9826908,
    candidates: [
      {
        name: 'Mahinda Rajapaksa',
        party: 'UPFA',
        votes: 4887152,
        votingPercentage: 50.29,
        color: '#E51C23',
        isWinner: true,
        bio: 'Former prime minister running on a platform of peace through strength',
        manifesto: 'Renegotiating the ceasefire with LTTE and strengthening national security'
      },
      {
        name: 'Ranil Wickremesinghe',
        party: 'UNP',
        votes: 4706366,
        votingPercentage: 48.43,
        color: '#4CAF50',
        isWinner: false,
        bio: 'Former prime minister advocating for peace negotiations',
        manifesto: 'Peaceful resolution to the civil conflict and economic liberalization'
      },
      {
        name: 'Other Candidates',
        party: 'Various',
        votes: 124632,
        votingPercentage: 1.28,
        color: '#9E9E9E',
        isWinner: false
      }
    ],
    turnoutTrend: [
      { year: 2000, percentage: 70.1 },
      { year: 2005, percentage: 73.7 }
    ],
    facts: [
      {
        content: 'This election was one of the closest in Sri Lankan history with less than a 2% margin between the top two candidates.',
        category: 'general'
      },
      {
        content: 'The LTTE enforced a boycott of the election in areas under their control, which impacted the final results.',
        category: 'general'
      },
      {
        content: 'The election centered on how to address the ongoing civil conflict, with the two main candidates offering different approaches.',
        category: 'general'
      }
    ],
    electionFact: 'The 2005 presidential election was one of the closest in Sri Lankan history, with Mahinda Rajapaksa winning by a margin of just 1.86% of the votes.'
  }
];

// Upcoming election data for testing
const upcomingElectionData = [
  {
    title: '2025 Presidential Election',
    description: 'The upcoming Sri Lankan presidential election scheduled for 2025',
    year: 2025,
    type: 'presidential',
    date: new Date('2025-11-17'),
    status: 'upcoming',
    candidates: [
      {
        name: 'Anura Kumara Dissanayake',
        party: 'NPP',
        color: '#B71C1C',
        bio: 'Current President of Sri Lanka and leader of the National People\'s Power coalition',
        manifesto: 'Economic recovery, anti-corruption, and social welfare expansion'
      },
      {
        name: 'Sajith Premadasa',
        party: 'SJB',
        color: '#1B5E20',
        bio: 'Leader of the Opposition and head of Samagi Jana Balawegaya',
        manifesto: 'Democratic reforms, social justice, and economic revitalization'
      },
      {
        name: 'Namal Rajapaksa',
        party: 'SLPP',
        color: '#880E4F',
        bio: 'Rising political figure in the Rajapaksa family',
        manifesto: 'National security, infrastructure development, and cultural preservation'
      }
    ],
    facts: [
      {
        content: 'Remember to bring a valid ID card to your polling station.',
        category: 'tip',
        displayAt: new Date(new Date('2025-11-10').setHours(9, 0, 0)),
        displayed: false
      },
      {
        content: 'The 2025 presidential election will have more polling stations than any previous election in Sri Lankan history.',
        category: 'general',
        displayAt: new Date(new Date('2025-10-17').setHours(12, 0, 0)),
        displayed: false
      },
      {
        content: 'Presidential elections in Sri Lanka are held every 5 years.',
        category: 'general',
        displayAt: null,
        displayed: false
      },
      {
        content: 'Polling stations will be open from 7:00 AM to 5:00 PM on election day.',
        category: 'tip',
        displayAt: new Date(new Date('2025-11-16').setHours(8, 0, 0)),
        displayed: false
      },
      {
        content: 'Election results are typically announced within 24-48 hours after polls close.',
        category: 'general',
        displayAt: new Date(new Date('2025-11-17').setHours(17, 30, 0)),
        displayed: false
      }
    ],
    electionFact: 'The 2025 election will be the first presidential election in Sri Lanka after the economic crisis of 2022.'
  },
  {
    title: '2025 Parliamentary Election',
    description: 'General election to elect members to the Parliament of Sri Lanka',
    year: 2025,
    type: 'parliamentary',
    date: new Date('2025-08-05'),
    status: 'upcoming',
    facts: [
      {
        content: 'Parliamentary elections determine the 225 members who will serve in the Sri Lankan Parliament.',
        category: 'general',
        displayed: false
      },
      {
        content: 'In parliamentary elections, 196 members are elected from electoral districts and 29 from national lists.',
        category: 'general',
        displayed: false
      },
      {
        content: 'Make sure your name is on the electoral register to be eligible to vote.',
        category: 'tip',
        displayAt: new Date(new Date('2025-07-05').setHours(10, 0, 0)),
        displayed: false
      }
    ],
    electionFact: 'Parliamentary elections in Sri Lanka use a proportional representation system with preferential voting.'
  }
];

// Function to seed the database with election data
const seedElections = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing election data if needed
    console.log('Clearing existing election data...');
    await Election.deleteMany({});
    
    // Insert past elections
    console.log('Inserting past election data...');
    await Election.insertMany(pastElectionData);
    
    // Insert upcoming elections
    console.log('Inserting upcoming election data...');
    await Election.insertMany(upcomingElectionData);
    
    console.log('Successfully seeded election data');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding election data:', error);
    
    // Ensure mongoose connection is closed on error
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB due to error');
    }
  }
};

// Run the seed function
seedElections();