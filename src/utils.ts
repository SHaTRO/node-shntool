
import 'console';

/*** SAFE STRING ***/

const UNICODE_CHARS = {
  '<'     : '\\u003C',
  '>'     : '\\u003E',
  '/'     : '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

const UNSAFE_CHARS_PATTERN = /[<>/\u2028\u2029]/g;

function replaceUnsafeChar(char: string): string {
  return UNICODE_CHARS[char];
}

function atomSafeString(str: string|number): string {
  if (str === '') return str;
  if (str === null || str === undefined) return undefined;
  if (typeof str !== 'string') {
    console.error('non-string passed to safeString()');
    return undefined;
  }
  // this code adapted from rtsao/safe-string
  return str.replace(UNSAFE_CHARS_PATTERN, replaceUnsafeChar);
}

export function safeString(str: string): string {
  return atomSafeString(str);
}


/*** SAFE BOOLEAN ***/

function atomSafeBoolean(bool: boolean): boolean {
  if (typeof bool !== 'boolean') {
    console.error('non-boolean passed to safeBoolean()');
    return undefined;
  }
  return (bool !== null && bool !== undefined && bool !== false && !!bool);
}

export function safeBoolean(bool: boolean): boolean {
  return atomSafeBoolean(bool);
}
