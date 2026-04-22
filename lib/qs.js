import { _helpers } from './_helpers.js';

const decodeQueryPart = (value = '') => {
  try {
    return decodeURIComponent(value.replace(/\+/g, ' '));
  } catch (_error) {
    return value;
  }
};

const encodeQueryPart = (value = '') => {
  try {
    return encodeURIComponent(`${value}`);
  } catch (_error) {
    return `${value}`;
  }
};

const getPathTokens = (key = '') => {
  const tokens = [];
  const matcher = /([^[\]]+)|\[(.*?)\]/g;
  let match = matcher.exec(key);
  while (match !== null) {
    tokens.push(match[1] !== undefined ? match[1] : match[2]);
    match = matcher.exec(key);
  }

  return tokens;
};

const isArrayToken = (token) => token === '' || /^\d+$/.test(token);

const ensureContainer = (value, nextToken) => {
  if (value && _helpers.isObject(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    return value;
  }

  return isArrayToken(nextToken) ? [] : {};
};

const mergeLeaf = (target, key, value) => {
  if (!Object.prototype.hasOwnProperty.call(target, key)) {
    target[key] = value;
    return;
  }

  if (Array.isArray(target[key])) {
    target[key].push(value);
    return;
  }

  target[key] = [target[key], value];
};

const setDeepValue = (target, tokens, value) => {
  if (!tokens.length) {
    return;
  }

  if (tokens.length === 1 && tokens[0] !== '') {
    mergeLeaf(target, tokens[0], value);
    return;
  }

  let cursor = target;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const isLast = i === tokens.length - 1;
    const nextToken = tokens[i + 1];

    if (token === '__proto__' || token === 'constructor' || token === 'prototype') {
      return;
    }

    if (isLast) {
      if (token === '') {
        if (!Array.isArray(cursor)) {
          return;
        }
        cursor.push(value);
      } else if (Array.isArray(cursor) && /^\d+$/.test(token)) {
        const index = Number(token);
        if (cursor[index] !== undefined) {
          cursor.push(value);
        } else {
          cursor[index] = value;
        }
      } else if (_helpers.isObject(cursor)) {
        mergeLeaf(cursor, token, value);
      }
      return;
    }

    if (token === '') {
      if (!Array.isArray(cursor)) {
        return;
      }
      const container = ensureContainer(undefined, nextToken);
      cursor.push(container);
      cursor = container;
      continue;
    }

    if (Array.isArray(cursor) && /^\d+$/.test(token)) {
      const index = Number(token);
      let current = cursor[index];
      if (!_helpers.isObject(current) && !Array.isArray(current)) {
        current = ensureContainer(current, nextToken);
        cursor[index] = current;
      }
      cursor = current;
      continue;
    }

    if (!_helpers.isObject(cursor)) {
      return;
    }

    let current = cursor[token];
    if (!Array.isArray(current) && !_helpers.isObject(current)) {
      const prev = current;
      current = ensureContainer(current, nextToken);
      if (Array.isArray(current) && typeof prev !== 'undefined') {
        current.push(prev);
      }
      cursor[token] = current;
    }
    cursor = current;
  }
};

const buildPairs = (value, key, pairs) => {
  if (typeof value === 'undefined') {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, idx) => {
      buildPairs(item, `${key}[${idx}]`, pairs);
    });
    return;
  }

  if (_helpers.isObject(value)) {
    Object.keys(value).forEach((nestedKey) => {
      buildPairs(value[nestedKey], `${key}[${nestedKey}]`, pairs);
    });
    return;
  }

  pairs.push(`${encodeQueryPart(key)}=${encodeQueryPart(value)}`);
};

const mergeObjects = (base, override) => {
  const result = _helpers.clone(base);

  Object.keys(override || {}).forEach((key) => {
    const left = result[key];
    const right = override[key];
    const leftIsObj = _helpers.isObject(left) && !Array.isArray(left);
    const rightIsObj = _helpers.isObject(right) && !Array.isArray(right);

    if (leftIsObj && rightIsObj) {
      result[key] = mergeObjects(left, right);
    } else {
      result[key] = right;
    }
  });

  return result;
};

const qs = {
  parse(query = '') {
    if (!query || !_helpers.isString(query)) {
      return {};
    }

    const cleanQuery = query.replace(/^\?/, '');
    if (!cleanQuery) {
      return {};
    }

    return cleanQuery.split('&').reduce((acc, pair) => {
      if (!pair) {
        return acc;
      }

      const [rawKey, ...rawValueParts] = pair.split('=');
      const decodedKey = decodeQueryPart(rawKey);
      if (!decodedKey) {
        return acc;
      }

      const value = decodeQueryPart(rawValueParts.join('='));
      const tokens = getPathTokens(decodedKey);
      if (!tokens.length) {
        return acc;
      }
      setDeepValue(acc, tokens, value);
      return acc;
    }, {});
  },

  stringify(queryParams = {}) {
    if (!queryParams || !_helpers.isObject(queryParams)) {
      return '';
    }

    const pairs = [];
    Object.keys(queryParams).forEach((key) => {
      buildPairs(queryParams[key], key, pairs);
    });

    return pairs.join('&');
  },

  merge(baseQueryParams = {}, queryParams = {}) {
    if (!_helpers.isObject(baseQueryParams) || Array.isArray(baseQueryParams)) {
      return _helpers.isObject(queryParams) ? _helpers.clone(queryParams) : {};
    }
    if (!_helpers.isObject(queryParams) || Array.isArray(queryParams)) {
      return _helpers.clone(baseQueryParams);
    }

    return mergeObjects(baseQueryParams, queryParams);
  }
};

export { qs };
