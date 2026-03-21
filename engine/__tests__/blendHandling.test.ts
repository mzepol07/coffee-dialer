/**
 * Test suite for blend handling in the brew recommendation system.
 *
 * To run these tests, first install a test framework:
 * npm install --save-dev vitest @vitest/ui
 *
 * Then add to package.json scripts:
 * "test": "vitest"
 *
 * Run with: npm test
 */

import { describe, it, expect } from 'vitest';
import { getEffectiveProcessing, shouldUseBalancedDefaults, getProcessingDisplayLabel } from '../blendUtils';
import { generateRecommendation } from '../recommend';
import { Context } from '../types';
import { getGrinderById, getBrewerById, getFilterById } from '@/catalog';

describe('Blend Processing Utilities', () => {
  describe('getEffectiveProcessing', () => {
    it('should return the processing method for single-origin coffee', () => {
      const result = getEffectiveProcessing('washed', false);
      expect(result).toBe('washed');
    });

    it('should return the same processing when blend has uniform components', () => {
      const result = getEffectiveProcessing('washed', true, ['washed', 'washed', 'washed']);
      expect(result).toBe('washed');
    });

    it('should return "mixed" when blend has multiple processing methods', () => {
      const result = getEffectiveProcessing('washed', true, ['washed', 'natural']);
      expect(result).toBe('mixed');
    });

    it('should normalize natural_anaerobic to natural for comparison', () => {
      const result = getEffectiveProcessing('natural', true, ['natural', 'natural_anaerobic']);
      expect(result).toBe('natural');
    });

    it('should return "blend" when blend has unknown processing', () => {
      const result = getEffectiveProcessing('washed', true, null);
      expect(result).toBe('blend');
    });

    it('should return "blend" when processing is unknown', () => {
      const result = getEffectiveProcessing('unknown', true);
      expect(result).toBe('blend');
    });

    it('should use explicit processing if set for blend', () => {
      const result = getEffectiveProcessing('honey', true, null);
      expect(result).toBe('honey');
    });
  });

  describe('shouldUseBalancedDefaults', () => {
    it('should return true for "mixed" processing', () => {
      expect(shouldUseBalancedDefaults('mixed')).toBe(true);
    });

    it('should return true for "blend" processing', () => {
      expect(shouldUseBalancedDefaults('blend')).toBe(true);
    });

    it('should return true for "unknown" processing', () => {
      expect(shouldUseBalancedDefaults('unknown')).toBe(true);
    });

    it('should return false for known processing methods', () => {
      expect(shouldUseBalancedDefaults('washed')).toBe(false);
      expect(shouldUseBalancedDefaults('honey')).toBe(false);
      expect(shouldUseBalancedDefaults('natural')).toBe(false);
    });
  });

  describe('getProcessingDisplayLabel', () => {
    it('should display "Blend (Mixed Processing)" for mixed blends', () => {
      const result = getProcessingDisplayLabel('mixed', true);
      expect(result).toBe('Blend (Mixed Processing)');
    });

    it('should display "Blend" for unknown blend', () => {
      const result = getProcessingDisplayLabel('blend', true);
      expect(result).toBe('Blend');
    });

    it('should display "Blend (Washed)" for washed blend', () => {
      const result = getProcessingDisplayLabel('washed', true);
      expect(result).toBe('Blend (Washed)');
    });

    it('should display processing name for single-origin', () => {
      const result = getProcessingDisplayLabel('washed', false);
      expect(result).toBe('Washed');
    });
  });
});

describe('Blend Recommendation Generation', () => {
  const grinder = getGrinderById('k_ultra')!;
  const brewer = getBrewerById('v60_plastic')!;
  const filter = getFilterById('hario_white')!;

  const createContext = (
    processing: any,
    isBlend: boolean = false,
    roast: any = 'medium_light'
  ): Context => ({
    coffee: {
      processing,
      roast,
      goal: 'balanced',
      is_blend: isBlend,
    },
    brew: {
      grinder,
      brewer,
      filter,
      dose_g: 15,
    },
  });

  describe('Single-origin washed coffee', () => {
    it('should apply washed processing adjustments', () => {
      const context = createContext('washed', false);
      const recommendation = generateRecommendation(context);

      expect(recommendation.spec.temp_f).toBeGreaterThan(200); // Washed adds +3°F
      expect(recommendation.reasons.some(r => r.factor === 'Washed processing')).toBe(true);
    });
  });

  describe('Blend with all washed components', () => {
    it('should apply washed processing adjustments when uniform', () => {
      const context = createContext('washed', true);
      const recommendation = generateRecommendation(context);

      expect(recommendation.spec.temp_f).toBeGreaterThan(200); // Washed adds +3°F
      expect(recommendation.reasons.some(r => r.factor === 'Washed processing')).toBe(true);
    });
  });

  describe('Blend with mixed processing (washed + natural)', () => {
    it('should use balanced defaults and rely on roast level', () => {
      const context = createContext('mixed', true);
      const recommendation = generateRecommendation(context);

      expect(recommendation.reasons.some(r => r.factor.includes('Blend'))).toBe(true);
      expect(recommendation.summary).toContain('balanced recipe');
    });

    it('should prioritize roast level adjustments', () => {
      const lightRoastContext = createContext('mixed', true, 'light');
      const mediumRoastContext = createContext('mixed', true, 'medium');

      const lightRec = generateRecommendation(lightRoastContext);
      const mediumRec = generateRecommendation(mediumRoastContext);

      // Light roast should have hotter water than medium roast
      expect(lightRec.spec.temp_f).toBeGreaterThan(mediumRec.spec.temp_f);
    });
  });

  describe('Blend with unknown processing', () => {
    it('should use balanced defaults and not default to washed', () => {
      const context = createContext('blend', true);
      const recommendation = generateRecommendation(context);

      expect(recommendation.reasons.some(r => r.factor === 'Blend')).toBe(true);
      expect(recommendation.summary).toContain('balanced recipe');
      expect(recommendation.reasons.some(r => r.factor === 'Washed processing')).toBe(false);
    });

    it('should generate recommendation text about adjusting by taste', () => {
      const context = createContext('unknown', true);
      const recommendation = generateRecommendation(context);

      expect(recommendation.summary).toContain('adjust by taste');
    });
  });

  describe('Temperature bounds for blends', () => {
    it('should stay within safe temperature range (195-212°F)', () => {
      const contexts = [
        createContext('mixed', true, 'light'),
        createContext('blend', true, 'medium'),
        createContext('unknown', true, 'light'),
      ];

      contexts.forEach(context => {
        const recommendation = generateRecommendation(context);
        expect(recommendation.spec.temp_f).toBeGreaterThanOrEqual(195);
        expect(recommendation.spec.temp_f).toBeLessThanOrEqual(212);
      });
    });
  });

  describe('Grind recommendations for blends', () => {
    it('should use medium baseline for unknown blend processing', () => {
      const context = createContext('blend', true);
      const recommendation = generateRecommendation(context);

      // Grind index should be around medium range (0.75-1.4)
      expect(recommendation.spec.grind_index).toBeGreaterThanOrEqual(0);
      expect(recommendation.spec.grind_index).toBeLessThanOrEqual(2);
    });
  });

  describe('New processing methods', () => {
    it('should handle natural processing', () => {
      const context = createContext('natural', false);
      const recommendation = generateRecommendation(context);

      expect(recommendation.spec.temp_f).toBeLessThan(200); // Natural reduces temp
      expect(recommendation.reasons.some(r => r.factor.includes('Natural'))).toBe(true);
    });

    it('should handle anaerobic processing', () => {
      const context = createContext('anaerobic', false);
      const recommendation = generateRecommendation(context);

      expect(recommendation.spec.temp_f).toBeLessThan(200); // Anaerobic reduces temp
      expect(recommendation.reasons.some(r => r.factor.includes('Natural'))).toBe(true);
    });

    it('should handle wet hulled processing', () => {
      const context = createContext('wet_hulled', false);
      const recommendation = generateRecommendation(context);

      expect(recommendation.reasons.some(r => r.factor === 'Wet hulled processing')).toBe(true);
    });
  });
});

describe('Blend Adjustment Strategy', () => {
  it('should reduce reliance on process-specific heuristics for blends', () => {
    const grinder = getGrinderById('k_ultra')!;
    const brewer = getBrewerById('v60_plastic')!;
    const filter = getFilterById('hario_white')!;

    const blendContext: Context = {
      coffee: {
        processing: 'mixed',
        roast: 'medium_light',
        goal: 'balanced',
        is_blend: true,
      },
      brew: { grinder, brewer, filter, dose_g: 15 },
    };

    const recommendation = generateRecommendation(blendContext);

    // Should not have process-specific adjustments
    expect(recommendation.reasons.some(r =>
      r.factor === 'Washed processing' ||
      r.factor === 'Natural/anaerobic processing'
    )).toBe(false);

    // Should prioritize roast level
    expect(recommendation.reasons.some(r =>
      r.factor.includes('roast')
    )).toBe(true);
  });
});
