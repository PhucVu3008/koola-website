/**
 * JWT Token Test Utility
 * 
 * Paste this in browser console to test JWT token functions
 */

// Copy this to browser console after logging in:

/*
// Test 1: Check current token status
import { getTokenDebugInfo } from '@/lib/admin-auth';
console.log('Token Status:', getTokenDebugInfo());

// Test 2: Check authentication
import { isAuthenticated } from '@/lib/admin-auth';
console.log('Is Authenticated:', isAuthenticated());

// Test 3: Get time remaining
import { getTokenTimeRemaining, getAccessToken } from '@/lib/admin-auth';
const token = getAccessToken();
console.log('Time Remaining:', getTokenTimeRemaining(token), 'seconds');

// Test 4: Get expiration date
import { getTokenExpiration } from '@/lib/admin-auth';
console.log('Expires At:', getTokenExpiration(token));

// Test 5: Manual token expiration check
import { isTokenExpired } from '@/lib/admin-auth';
console.log('Is Expired:', isTokenExpired(token));
*/

// Or use this simpler version (copy all):
(function testTokens() {
  const accessToken = localStorage.getItem('koola_admin_access_token');
  const refreshToken = localStorage.getItem('koola_admin_refresh_token');
  
  if (!accessToken || !refreshToken) {
    console.log('❌ No tokens found. Please login first.');
    return;
  }
  
  // Decode manually
  function decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
  
  const accessDecoded = decodeJWT(accessToken);
  const refreshDecoded = decodeJWT(refreshToken);
  const now = Math.floor(Date.now() / 1000);
  
  console.log('=================================');
  console.log('🔐 JWT Token Information');
  console.log('=================================');
  
  if (accessDecoded) {
    const accessRemaining = Math.max(0, accessDecoded.exp - now);
    const accessExpired = accessDecoded.exp < now;
    
    console.log('\n📝 Access Token:');
    console.log('  User ID:', accessDecoded.id);
    console.log('  Email:', accessDecoded.email);
    console.log('  Issued At:', new Date(accessDecoded.iat * 1000).toLocaleString());
    console.log('  Expires At:', new Date(accessDecoded.exp * 1000).toLocaleString());
    console.log('  Time Remaining:', accessRemaining, 'seconds');
    console.log('  Status:', accessExpired ? '❌ EXPIRED' : '✅ VALID');
    
    if (!accessExpired && accessRemaining < 300) {
      console.log('  ⚠️  Warning: Token expires in less than 5 minutes!');
    }
  }
  
  if (refreshDecoded) {
    const refreshRemaining = Math.max(0, refreshDecoded.exp - now);
    const refreshExpired = refreshDecoded.exp < now;
    
    console.log('\n🔄 Refresh Token:');
    console.log('  Issued At:', new Date(refreshDecoded.iat * 1000).toLocaleString());
    console.log('  Expires At:', new Date(refreshDecoded.exp * 1000).toLocaleString());
    console.log('  Time Remaining:', refreshRemaining, 'seconds');
    console.log('  Status:', refreshExpired ? '❌ EXPIRED' : '✅ VALID');
    
    if (!refreshExpired && refreshRemaining < 86400) {
      console.log('  ⚠️  Warning: Refresh token expires in less than 24 hours!');
    }
  }
  
  console.log('\n=================================');
  console.log('Summary:');
  console.log('  Authentication:', 
    (accessDecoded && accessDecoded.exp > now) ? '✅ VALID' : '❌ INVALID');
  console.log('=================================\n');
})();
