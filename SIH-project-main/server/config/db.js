const { initialSeedData } = require('../data/seedData');

// Resilient memory-first data store for all 13 collections
class ResilientDB {
  constructor() {
    this.collections = {
      users: [],
      farmers: [],
      farms: [],
      villages: [],
      crops: [],
      disease_reports: [],
      disease_predictions: [],
      weather_data: [],
      alerts: [],
      agri_officers: [],
      field_visits: [],
      ivr_calls: [],
      sms_logs: []
    };
    this.init();
  }

  init() {
    // Deep clone initial seed data
    Object.keys(this.collections).forEach((collectionName) => {
      const seedItems = initialSeedData[collectionName] || [];
      this.collections[collectionName] = JSON.parse(JSON.stringify(seedItems));
    });
    console.log('[ResilientDB] Initialized with 13 collections and seed data.');
  }

  reset() {
    this.init();
    return { success: true, message: 'Database reset to default seed data.' };
  }

  get(collectionName) {
    if (!this.collections[collectionName]) {
      this.collections[collectionName] = [];
    }
    return this.collections[collectionName];
  }

  find(collectionName, query = {}) {
    const items = this.get(collectionName);
    return items.filter((item) => {
      return Object.keys(query).every((key) => {
        if (query[key] === undefined) return true;
        return item[key] === query[key];
      });
    });
  }

  findOne(collectionName, query = {}) {
    const results = this.find(collectionName, query);
    return results.length > 0 ? results[0] : null;
  }

  findById(collectionName, id) {
    const items = this.get(collectionName);
    return items.find((item) => item.id === id || item._id === id) || null;
  }

  create(collectionName, doc) {
    const items = this.get(collectionName);
    const newDoc = {
      id: doc.id || `${collectionName.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...doc
    };
    items.unshift(newDoc); // newest first
    return newDoc;
  }

  update(collectionName, id, updates) {
    const items = this.get(collectionName);
    const index = items.findIndex((item) => item.id === id || item._id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return items[index];
  }

  delete(collectionName, id) {
    const items = this.get(collectionName);
    const index = items.findIndex((item) => item.id === id || item._id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    return true;
  }
}

const db = new ResilientDB();

module.exports = db;
