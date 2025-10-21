/**
 * Utility Functions
 * 
 * Common helper functions used throughout the application
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a UUID v4
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * Format duration in seconds to a human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "5:23" or "1:02:15")
 */
export function formatDuration(seconds: number | null): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get the appropriate text based on current language
 * @param jpText - Japanese text
 * @param enText - English text (optional)
 * @param lang - Current language
 * @returns Appropriate text for the language
 */
export function getLocalizedText(
  jpText: string,
  enText: string | null,
  lang: 'en' | 'ja'
): string {
  if (lang === 'en' && enText) {
    return enText;
  }
  return jpText;
}

/**
 * Truncate text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Sanitize filename for safe storage
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * Parse and validate audio file
 * @param file - File object
 * @returns Validation result
 */
export function validateAudioFile(file: File): { 
  valid: boolean; 
  error?: string 
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/wav'];
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Allowed: AAC, MP3, WAV' 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'File size exceeds 10MB limit' 
    };
  }
  
  return { valid: true };
}

/**
 * Create a slug from text
 * @param text - Text to convert
 * @returns URL-safe slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Format date to locale string
 * @param dateString - ISO date string
 * @param lang - Language preference
 * @returns Formatted date
 */
export function formatDate(dateString: string, lang: 'en' | 'ja' = 'en'): string {
  const date = new Date(dateString);
  const locale = lang === 'ja' ? 'ja-JP' : 'en-US';
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Debounce function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

