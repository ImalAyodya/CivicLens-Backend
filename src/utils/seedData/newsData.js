const newsData = [
  {
    title: 'President Anura Kumara Announces Economic Revival Plan',
    content: `President Anura Kumara Dissanayake unveiled a comprehensive economic revival plan aimed at addressing Sri Lanka's ongoing economic challenges. The plan focuses on debt restructuring, improving foreign investments, and strengthening local industries.

"Our focus is on creating sustainable economic growth that benefits all citizens," stated the President during the announcement at the Presidential Secretariat.

The plan includes specific targets for inflation reduction, employment growth, and fiscal consolidation over the next three years. International financial institutions have expressed cautious optimism about the proposed measures.

Opposition parties have offered mixed responses, with some criticizing the timeline as too ambitious while others have pledged conditional support for key initiatives.`,
    summary: 'President outlines new economic plan focusing on debt restructuring and local industry growth.',
    category: 'policy',
    author: 'Dinuka Perera',
    source: 'CivicLens',
    imageUrl: '/assets/news/economic-plan.jpg',
    isBreaking: true,
    isFeatured: true,
    tags: ['economy', 'policy', 'president', 'NPP'],
    publishedDate: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    relatedPoliticians: ['Anura Kumara Dissanayake']
  },
  {
    title: 'Parliament Approves Constitutional Amendment',
    content: `The Sri Lankan Parliament has approved the 22nd Amendment to the Constitution with a two-thirds majority after a two-day debate. The amendment aims to strengthen democratic institutions and reduce the powers of the executive presidency.

Key provisions include reinstating the Constitutional Council, limiting presidential immunity, and enhancing parliamentary oversight of executive functions.

"This is a significant step towards restoring democratic checks and balances," said the Justice Minister during the parliamentary session.

The amendment received support across party lines, though some members expressed reservations about specific clauses.

Civil society organizations have generally welcomed the changes, calling them "a necessary step toward political reform."`,
    summary: 'MPs vote in favor of constitutional changes to limit presidential powers and strengthen democratic institutions.',
    category: 'legal',
    author: 'Kamala Jayawardena',
    source: 'CivicLens',
    imageUrl: '/assets/news/parliament-vote.jpg',
    isBreaking: false,
    isFeatured: true,
    tags: ['constitution', 'parliament', 'democracy', 'reform'],
    publishedDate: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  },
  {
    title: 'New Education Reforms to Modernize Curriculum',
    content: `The Ministry of Education has announced comprehensive reforms to modernize Sri Lanka's school curriculum, focusing on digital skills, critical thinking, and practical applications.

The reforms, to be implemented over a three-year period, will introduce coding and technology subjects from primary school levels, reduce exam pressure, and incorporate more project-based learning.

"These changes reflect the needs of the 21st-century job market," explained the Education Minister at a press conference. "We want to prepare our students for the global economy."

Teacher unions have called for adequate training and resources to support the transition, while parent associations have generally responded positively to the proposed changes.

Pilot programs will begin in selected schools next academic year before nationwide implementation.`,
    summary: 'Education Ministry unveils plans to update school curriculum with focus on technology and critical thinking.',
    category: 'education',
    author: 'Priya Gunaratne',
    source: 'CivicLens',
    imageUrl: '/assets/news/education-reform.jpg',
    isBreaking: false,
    isFeatured: false,
    tags: ['education', 'reform', 'technology', 'schools'],
    publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    title: 'Opposition Leader Proposes Alternative Budget Plan',
    content: `Opposition Leader Sajith Premadasa has presented an alternative budget plan, challenging the government's economic priorities and proposing different approaches to fiscal management.

The opposition's plan emphasizes greater investment in social welfare programs, healthcare, and small business support, while criticizing current spending on infrastructure projects.

"We need to focus on people's immediate needs rather than vanity projects," Premadasa stated during a press conference at opposition headquarters.

Government representatives dismissed the alternative budget as "unrealistic" and "lacking proper fiscal discipline," defending their own economic strategy as necessary for long-term growth.

Economic analysts note that while both plans address Sri Lanka's economic challenges, they reflect fundamentally different philosophies about the role of government in economic development.`,
    summary: 'SJB presents competing fiscal framework with emphasis on social spending and small business support.',
    category: 'economy',
    author: 'Malik Fernando',
    source: 'CivicLens',
    imageUrl: '/assets/news/budget-proposal.jpg',
    isBreaking: false,
    isFeatured: false,
    tags: ['economy', 'budget', 'opposition', 'SJB'],
    publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    relatedPoliticians: ['Sajith Premadasa']
  },
  {
    title: 'Government Launches National Infrastructure Development Program',
    content: `The Sri Lankan government has launched an ambitious five-year National Infrastructure Development Program focusing on transportation networks, renewable energy, and water management systems.

The Rs. 2.5 trillion program aims to modernize the country's infrastructure while creating over 100,000 jobs in construction and related industries.

"This investment will lay the foundation for sustainable economic growth for decades to come," the Prime Minister stated during the launching ceremony.

Key projects include highway expansions connecting major cities, solar and wind power installations, and modernization of urban water systems.

The program will be funded through a combination of government allocations, international development loans, and public-private partnerships. Critics have raised concerns about debt sustainability, while supporters emphasize the long-term economic benefits.`,
    summary: 'Five-year plan announced for major upgrades to transportation, energy, and water systems across the country.',
    category: 'development',
    author: 'Roshan Silva',
    source: 'CivicLens',
    imageUrl: '/assets/news/infrastructure.jpg',
    isBreaking: false,
    isFeatured: true,
    tags: ['infrastructure', 'development', 'economy', 'jobs'],
    publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  }
];

module.exports = { newsData };