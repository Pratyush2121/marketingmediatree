const bcrypt = require('bcryptjs');
const jsonDb = require('../utils/jsonDb');

class MockModel {
  constructor(collectionName) {
    this.collection = collectionName;
  }

  async countDocuments() {
    const data = jsonDb.readData(this.collection);
    return data.length;
  }

  // MOCK find() with chainable .sort()
  find(filter = {}) {
    let data = jsonDb.readData(this.collection);

    // Apply filtering if keywords are provided (used in leads search)
    if (filter && filter.$or) {
      data = data.filter(item => {
        return filter.$or.some(condition => {
          const key = Object.keys(condition)[0];
          const queryObj = condition[key];
          const regexVal = queryObj.$regex;
          if (regexVal && item[key]) {
            const regex = new RegExp(regexVal, 'i');
            return regex.test(item[key]);
          }
          return false;
        });
      });
    }

    const chainable = {
      sort: (sortObj) => {
        data.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0);
          const dateB = new Date(b.createdAt || b.date || 0);
          return dateB - dateA; // Descending sort
        });
        return Promise.resolve(data);
      },
      then: (resolve) => resolve(data),
      catch: (reject) => {}
    };

    // Make it behave like a Promise if .sort() is not called
    chainable.then = (resolve) => {
      resolve(data);
    };

    return chainable;
  }

  async findOne(query = {}) {
    const data = jsonDb.readData(this.collection);
    
    // Empty query (used in Map)
    if (Object.keys(query).length === 0) {
      const match = data[0] || null;
      return this._wrapDocument(match);
    }

    // Normal query (e.g. { email: ... } or { key: ... } or { slug: ... })
    const key = Object.keys(query)[0];
    const val = query[key];
    
    const match = data.find(item => {
      if (typeof val === 'string' && typeof item[key] === 'string') {
        return item[key].toLowerCase() === val.toLowerCase();
      }
      return item[key] === val;
    });

    return this._wrapDocument(match);
  }

  async findById(id) {
    const data = jsonDb.readData(this.collection);
    const match = data.find(item => item._id === id);
    return this._wrapDocument(match);
  }

  async create(docObj) {
    const data = jsonDb.readData(this.collection);
    
    // Generate new doc with standard Mongoose fields
    const doc = {
      _id: 'local_' + Date.now() + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      ...docObj
    };

    // Pre-save password encrypt (Admin)
    if (this.collection === 'admins' && doc.password) {
      const salt = await bcrypt.genSalt(10);
      doc.password = await bcrypt.hash(doc.password, salt);
    }

    // Pre-save slug generation (Blog)
    if (this.collection === 'blogs' && doc.title && !doc.slug) {
      doc.slug = doc.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    data.push(doc);
    jsonDb.writeData(this.collection, data);
    return this._wrapDocument(doc);
  }

  async findByIdAndUpdate(id, updateObj, options = {}) {
    const data = jsonDb.readData(this.collection);
    const idx = data.findIndex(item => item._id === id);
    if (idx === -1) return null;

    // Merge changes
    const updatedDoc = {
      ...data[idx],
      ...updateObj,
      updatedAt: new Date().toISOString()
    };

    data[idx] = updatedDoc;
    jsonDb.writeData(this.collection, data);
    return this._wrapDocument(updatedDoc);
  }

  async findByIdAndDelete(id) {
    const data = jsonDb.readData(this.collection);
    const idx = data.findIndex(item => item._id === id);
    if (idx === -1) return null;
    const deleted = data.splice(idx, 1)[0];
    jsonDb.writeData(this.collection, data);
    return deleted;
  }

  async insertMany(docsArr) {
    const data = jsonDb.readData(this.collection);
    const processed = docsArr.map(doc => ({
      _id: 'local_' + Date.now() + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      comments: doc.comments || [],
      ...doc
    }));
    data.push(...processed);
    jsonDb.writeData(this.collection, data);
    return processed.map(doc => this._wrapDocument(doc));
  }

  // Wrap documents to support Mongoose active methods (.save() and .comparePassword())
  _wrapDocument(doc) {
    if (!doc) return null;

    // Attach save() method to document
    doc.save = async function() {
      const currentData = jsonDb.readData(this.collection);
      
      // Match by _id or key (for unique Settings keys)
      const idx = currentData.findIndex(item => item._id === doc._id || (item.key && item.key === doc.key));
      
      if (idx !== -1) {
        currentData[idx] = doc;
        jsonDb.writeData(this.collection, currentData);
      } else {
        currentData.push(doc);
        jsonDb.writeData(this.collection, currentData);
      }
      return doc;
    }.bind(this);

    // Attach comparePassword() method for admin document verification
    if (this.collection === 'admins') {
      doc.comparePassword = async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, doc.password);
      };
    }

    return doc;
  }
}

// Instantiate mock models matching the schema collections
const Admin = new MockModel('admins');
const Blog = new MockModel('blogs');
const Contact = new MockModel('contacts');
const Setting = new MockModel('settings');
const Map = new MockModel('maps');
const Media = new MockModel('media');

module.exports = {
  Admin,
  Blog,
  Contact,
  Setting,
  Map,
  Media
};
