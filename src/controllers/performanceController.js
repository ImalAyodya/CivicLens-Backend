const Politician = require('../models/Politician');
const PromiseModel = require('../models/Promise'); // <-- change this line
const Party = require('../models/Party');
const Role = require('../models/Role');

// Get dashboard summary data for a specific politician
exports.getPoliticianDashboard = async (req, res) => {
  try {
    const { politicianId } = req.params;
    
    // Get politician details with populated references
    const politician = await Politician.findById(politicianId)
      .populate('party')
      .populate('currentRole')
      .populate('roles');
    
    if (!politician) {
      return res.status(404).json({ error: 'Politician not found' });
    }
    
    // Get all promises for this politician
    const promises = await PromiseModel.find({ politicianID: politicianId });
    
    // Calculate performance metrics
    const totalPromises = promises.length;
    const fulfilledPromises = promises.filter(p => p.promiseStatus === 'complete').length;
    const brokenPromises = promises.filter(p => p.promiseStatus === 'broken').length;
    const pendingPromises = promises.filter(p => p.promiseStatus === 'pending').length;
    
    // Calculate average performance score
    const avgPerformanceScore = promises.length > 0 
      ? promises.reduce((sum, p) => sum + p.performanceScore, 0) / promises.length 
      : 0;
    
    // Calculate average public approval rating
    const avgPublicApproval = promises.length > 0
      ? promises.reduce((sum, p) => sum + p.publicApprovalRating, 0) / promises.length
      : 0;
    
    // Get quarterly performance data
    const quarterlyData = await getQuarterlyPerformance(politicianId);
    
    // Get key promises (top 3 by performance score)
    const keyPromises = await PromiseModel.find({ politicianID: politicianId })
      .sort({ performanceScore: -1 })
      .limit(3);
    
    // Format key promises for dashboard
    const formattedKeyPromises = keyPromises.map(promise => ({
      id: promise._id,
      title: promise.promiseTitle,
      details: promise.promiseDetails,
      status: promise.promiseStatus,
      fulfillment: promise.promiseFulfillment,
      category: promise.promiseCategory
    }));
    
    // Return formatted dashboard data
    res.json({
      politician: {
        id: politician._id,
        name: politician.name,
        position: politician.currentRole ? politician.currentRole.title : 'Unknown',
        party: politician.party ? politician.party.fullName : 'Unknown',
        partyAbbreviation: politician.party ? politician.party.abbreviation : 'Unknown',
        partyColor: politician.party ? politician.party.color : '#000000',
        image: politician.image || '🧑‍💼',
      },
      performance: {
        score: Math.round(avgPerformanceScore),
        totalPromises,
        fulfilledPromises,
        brokenPromises,
        pendingPromises,
        fulfillmentRate: totalPromises > 0 ? (fulfilledPromises / totalPromises) * 100 : 0,
        publicApproval: Math.round(avgPublicApproval)
      },
      trends: {
        quarterly: quarterlyData,
        // Add other trend data as needed
      },
      keyPromises: formattedKeyPromises,
      recentActivities: await getRecentActivities(politicianId)
    });
  } catch (err) {
    console.error('Error in getPoliticianDashboard:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get list of all politicians with basic performance data
exports.getAllPoliticianPerformance = async (req, res) => {
  try {
    const politicians = await Politician.find()
      .populate('party')
      .populate('currentRole');
    
    const results = await Promise.all(politicians.map(async (politician) => {
      // Get promises for this politician
      const promises = await PromiseModel.find({ politicianID: politician._id.toString() });
      
      // Calculate performance metrics
      const totalPromises = promises.length;
      const fulfilledPromises = promises.filter(p => p.promiseStatus === 'complete').length;
      
      // Calculate average performance score
      const avgPerformanceScore = promises.length > 0 
        ? promises.reduce((sum, p) => sum + p.performanceScore, 0) / promises.length 
        : 0;
      
      return {
        id: politician._id,
        name: politician.name,
        position: politician.currentRole ? politician.currentRole.title : 'Unknown',
        party: politician.party ? politician.party.fullName : 'Unknown',
        partyAbbreviation: politician.party ? politician.party.abbreviation : 'Unknown',
        image: politician.image || '🧑‍💼',
        score: Math.round(avgPerformanceScore),
        totalPromises,
        fulfilledPromises
      };
    }));
    
    res.json(results);
  } catch (err) {
    console.error('Error in getAllPoliticianPerformance:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get quarterly performance data
async function getQuarterlyPerformance(politicianId) {
  // Get all promises for this politician
  const promises = await PromiseModel.find({ politicianID: politicianId });
  
  // This is a simplified calculation - in a real app you'd store historical data
  // or calculate based on actual timestamps of promises or events
  
  // Here we'll create mock data to match your dashboard format
  return [
    { quarter: 'Q1', rating: 50 },
    { quarter: 'Q2', rating: 65 },
    { quarter: 'Q3', rating: 90 },
    { quarter: 'Q4', rating: 120 },
    { quarter: 'Now', rating: 100 }
  ];
}

// Get recent activities
async function getRecentActivities(politicianId) {
  // In a real app, you would fetch actual activities from a separate model
  // For now, returning mock data to match your dashboard
  return [
    {
      title: 'Budget Speech 2025',
      description: 'Presented the annual budget focusing on economic recovery.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      title: 'Education Bill Passed',
      description: 'Approved new funding for university research.',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    },
    {
      title: 'Health Campaign Launched',
      description: 'Started a national vaccination drive.',
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) // 3 weeks ago
    }
  ];
}

// Get performance by ministry
exports.getMinistryPerformance = async (req, res) => {
  try {
    // Group promises by ministry and calculate performance metrics
    const promises = await PromiseModel.find();
    
    // Group by ministry
    const ministryMap = {};
    
    promises.forEach(promise => {
      if (!ministryMap[promise.ministryName]) {
        ministryMap[promise.ministryName] = {
          ministry: promise.ministryName,
          totalPromises: 0,
          fulfilledPromises: 0,
          budget: 0,
          performance: 0
        };
      }
      
      const ministry = ministryMap[promise.ministryName];
      ministry.totalPromises++;
      if (promise.promiseStatus === 'complete') {
        ministry.fulfilledPromises++;
      }
      ministry.budget += promise.budgetAllocation;
      ministry.performance += promise.performanceScore;
    });
    
    // Calculate averages and format response
    const ministryPerformance = Object.values(ministryMap).map(ministry => ({
      ...ministry,
      utilization: ministry.totalPromises > 0 
        ? `${Math.round((ministry.fulfilledPromises / ministry.totalPromises) * 100)}%` 
        : '0%',
      budget: `$${(ministry.budget / 1000000).toFixed(1)}B`, // Format as $X.XB
      performance: ministry.totalPromises > 0 
        ? Math.round(ministry.performance / ministry.totalPromises) 
        : 0,
      status: getStatusLabel(ministry)
    }));
    
    res.json(ministryPerformance);
  } catch (err) {
    console.error('Error in getMinistryPerformance:', err);
    res.status(500).json({ error: err.message });
  }
};

// Helper to determine status label based on performance
function getStatusLabel(ministry) {
  const utilizationRate = ministry.totalPromises > 0 
    ? (ministry.fulfilledPromises / ministry.totalPromises) * 100 
    : 0;
  
  if (utilizationRate >= 85) return 'On Track';
  if (utilizationRate >= 70) return 'At Risk';
  return 'Needs Improvement';
}

// Get promise comparison for politicians
exports.comparePromisesById = async (req, res) => {
  try {
    const { politicianIds } = req.body; // Array of politician IDs to compare
    
    if (!politicianIds || !Array.isArray(politicianIds) || politicianIds.length < 2) {
      return res.status(400).json({ error: 'Please provide at least two politician IDs to compare' });
    }
    
    const comparisonData = await Promise.all(politicianIds.map(async (id) => {
      const politician = await Politician.findById(id)
        .populate('party')
        .populate('currentRole');
      
      if (!politician) {
        return null;
      }
      
      const promises = await PromiseModel.find({ politicianID: id });
      
      return {
        id: politician._id,
        name: politician.name,
        position: politician.currentRole ? politician.currentRole.title : 'Unknown',
        party: politician.party ? politician.party.fullName : 'Unknown',
        image: politician.image || '🧑‍💼',
        performanceScore: promises.length > 0 
          ? Math.round(promises.reduce((sum, p) => sum + p.performanceScore, 0) / promises.length) 
          : 0,
        totalPromises: promises.length,
        fulfilledPromises: promises.filter(p => p.promiseStatus === 'complete').length,
        brokenPromises: promises.filter(p => p.promiseStatus === 'broken').length,
        pendingPromises: promises.filter(p => p.promiseStatus === 'pending').length,
        publicApproval: promises.length > 0 
          ? Math.round(promises.reduce((sum, p) => sum + p.publicApprovalRating, 0) / promises.length) 
          : 0
      };
    }));
    
    // Filter out null values (politicians not found)
    const validData = comparisonData.filter(Boolean);
    
    res.json(validData);
  } catch (err) {
    console.error('Error in comparePromisesById:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get party performance
exports.getPartyPerformance = async (req, res) => {
  try {
    const parties = await Party.find();
    
    const partyPerformance = await Promise.all(parties.map(async (party) => {
      // Get all politicians from this party
      const politicians = await Politician.find({ party: party._id });
      
      let totalPromises = 0;
      let fulfilledPromises = 0;
      let totalPerformance = 0;
      
      // Calculate aggregated metrics
      await Promise.all(politicians.map(async (politician) => {
        const promises = await PromiseModel.find({ politicianID: politician._id.toString() });
        
        totalPromises += promises.length;
        fulfilledPromises += promises.filter(p => p.promiseStatus === 'complete').length;
        totalPerformance += promises.reduce((sum, p) => sum + p.performanceScore, 0);
      }));
      
      return {
        id: party._id,
        name: party.fullName,
        abbreviation: party.abbreviation,
        color: party.color,
        logo: party.logo,
        politicianCount: politicians.length,
        totalPromises,
        fulfilledPromises,
        fulfillmentRate: totalPromises > 0 ? (fulfilledPromises / totalPromises) * 100 : 0,
        averagePerformance: totalPromises > 0 ? totalPerformance / totalPromises : 0
      };
    }));
    
    res.json(partyPerformance);
  } catch (err) {
    console.error('Error in getPartyPerformance:', err);
    res.status(500).json({ error: err.message });
  }
};