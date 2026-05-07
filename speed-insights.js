// Vercel Speed Insights
// Import the injectSpeedInsights function from the installed package
import { injectSpeedInsights } from '/node_modules/@vercel/speed-insights/dist/index.mjs';

// Initialize Speed Insights
injectSpeedInsights({
    debug: false, // Set to true for development debugging
    sampleRate: 1, // Track 100% of page loads
});
