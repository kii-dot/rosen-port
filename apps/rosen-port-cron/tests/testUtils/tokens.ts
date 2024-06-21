import { Token } from '@rosen-port/db';
import tokens from '../assets/test-rosen-loen-tokens.json';

// Define the Chain enum as per your project's specifications
enum Chain {
  Ergo,
  Cardano,
  Bitcoin,
}

// Function to parse JSON and create a Map with the token name as the key
function generateTokenMap(jsonData: any): Map<string, Token> {
  const tokenMap = new Map<string, Token>();

  jsonData.tokens.forEach((tokenGroup: any) => {
    Object.keys(tokenGroup).forEach((chainKey) => {
      const tokenInfo = tokenGroup[chainKey];
      const token = new Token({
        id: tokenInfo.tokenId,
        name: tokenInfo.name,
        tokenId: tokenInfo.tokenId,
        nativeChain:
          Chain[chainKey.charAt(0).toUpperCase() + chainKey.slice(1)], // Ensure the nativeChain matches the enum
      });
      // Use the token's name as the key for the map
      tokenMap.set(tokenInfo.name, token);
    });
  });

  return tokenMap;
}

// Generate the map using the provided JSON
export const tokenMap = generateTokenMap(tokens);
