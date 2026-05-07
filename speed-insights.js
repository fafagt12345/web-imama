/**
 * Vercel Speed Insights Integration
 * Official implementation for HTML/Vanilla JavaScript projects
 * 
 * This script initializes Vercel Speed Insights following the official documentation.
 * It will automatically collect and report performance metrics to your Vercel dashboard.
 * 
 * Documentation: https://vercel.com/docs/speed-insights/quickstart
 */

(function() {
  'use strict';
  
  // Initialize the Speed Insights queue function
  // This allows metrics to be queued before the script loads
  window.si = window.si || function () {
    (window.siq = window.siq || []).push(arguments);
  };

  // Only run in production (when deployed on Vercel)
  // Skip in local development to avoid unnecessary tracking
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[Speed Insights] Development mode detected - tracking disabled');
    return;
  }

  // Inject the official Vercel Speed Insights script
  // This script is provided by Vercel and automatically configured for your deployment
  function injectSpeedInsightsScript() {
    var script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/speed-insights/script.js';
    
    script.onerror = function() {
      console.warn('[Speed Insights] Failed to load tracking script');
    };
    
    script.onload = function() {
      console.log('[Speed Insights] Tracking initialized successfully');
    };
    
    // Insert the script into the document
    var firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSpeedInsightsScript);
  } else {
    // DOM is already loaded
    injectSpeedInsightsScript();
  }
})();
