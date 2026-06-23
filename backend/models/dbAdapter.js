// Dynamic adapter to switch between MongoDB Mongoose models and local JSON DB Mock models
const getModels = () => {
  const useLocal = process.env.USE_LOCAL_JSON === 'true';

  if (useLocal) {
    return require('./mockModels');
  } else {
    return {
      Admin: require('./Admin'),
      Blog: require('./Blog'),
      Contact: require('./Contact'),
      Setting: require('./Setting'),
      Map: require('./Map'),
      Media: require('./Media')
    };
  }
};

// Synchronously check if the MongoDB URI is a placeholder or not, setting the environment variable immediately
if (process.env.USE_LOCAL_JSON === undefined) {
  const uri = process.env.MONGODB_URI || '';
  const isPlaceholder = !uri || 
    uri.includes('username:password') || 
    uri.includes('your_mongodb_atlas_uri') ||
    uri.includes('cluster.mongodb.net/marketingmediatree') ||
    uri === 'mongodb+srv://username:password@cluster.mongodb.net/marketingmediatree?retryWrites=true&w=majority';
  
  const isProduction = process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true';

  if (isPlaceholder && !isProduction) {
    process.env.USE_LOCAL_JSON = 'true';
    console.log('[Adapter] Synchronously detected placeholder MongoDB URI. Defaulting USE_LOCAL_JSON to true.');
  } else {
    process.env.USE_LOCAL_JSON = 'false';
  }
}

// Create Proxy wrappers for each model to resolve them dynamically at call-time rather than require-time
const getModelProxy = (modelName) => {
  return new Proxy({}, {
    get: (target, prop) => {
      const activeModel = getModels()[modelName];
      const value = activeModel[prop];
      if (typeof value === 'function') {
        return value.bind(activeModel);
      }
      return value;
    },
    set: (target, prop, value) => {
      const activeModel = getModels()[modelName];
      activeModel[prop] = value;
      return true;
    }
  });
};

module.exports = {
  Admin: getModelProxy('Admin'),
  Blog: getModelProxy('Blog'),
  Contact: getModelProxy('Contact'),
  Setting: getModelProxy('Setting'),
  Map: getModelProxy('Map'),
  Media: getModelProxy('Media')
};

