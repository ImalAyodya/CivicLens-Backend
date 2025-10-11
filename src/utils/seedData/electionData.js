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
  }
];

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

module.exports = { pastElectionData, upcomingElectionData };