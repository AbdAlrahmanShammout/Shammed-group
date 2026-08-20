import { describe, expect, it } from 'vitest';

import { parseApiError } from '@/api/parse-api-error';

describe('parseApiError', () => {
  it('maps the API error envelope', async () => {
    const inputResponse = new Response(
      JSON.stringify({
        message: 'Invalid input',
        code: 'BAD_USER_INPUT',
        statusCode: 422,
        validationErrorObjects: [{ property: 'password', constraints: { isNotEmpty: 'required' } }],
      }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    );
    const actual = await parseApiError(inputResponse);
    expect(actual.message).toBe('Invalid input');
    expect(actual.code).toBe('BAD_USER_INPUT');
    expect(actual.statusCode).toBe(422);
    expect(actual.validationErrorObjects).toHaveLength(1);
  });

  it('falls back when the body is not an API error envelope', async () => {
    const inputResponse = new Response('nope', { status: 500 });
    const actual = await parseApiError(inputResponse);
    expect(actual.message).toBe('Request failed');
    expect(actual.code).toBe('UNKNOWN_CODE');
    expect(actual.statusCode).toBe(500);
  });
});
