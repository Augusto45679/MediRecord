import { describe, expect, it } from 'vitest';
import { splitDose } from './scheduleUtils';

describe('splitDose', () => {
  it('splits on a standalone "de"', () => {
    expect(splitDose('1 comprimido de 500 mg')).toEqual({ amount: '1 comprimido', concentration: '500 mg' });
  });
  it('does not split inside words', () => {
    expect(splitDose('2 dedos de crema')).toEqual({ amount: '2 dedos', concentration: 'crema' });
    expect(splitDose('Media dosis')).toEqual({ amount: 'Media dosis', concentration: '' });
  });
});
