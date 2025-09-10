// Netlify Function wrapping the Express app
const serverless = require('serverless-http');
const { app, connectDB } = require('../../backend/app');

let handler;

async function getHandler() {
  if (!handler) {
    // Ensure DB is connected once per cold start
    await connectDB();
    handler = serverless(app, {
      binary: false,
      basePath: '/.netlify/functions/api',
    });
  }
  return handler;
}

exports.handler = async (event, context) => {
  // Keep Lambda warm-friendly
  context.callbackWaitsForEmptyEventLoop = false;
  const h = await getHandler();
  return h(event, context);
};
