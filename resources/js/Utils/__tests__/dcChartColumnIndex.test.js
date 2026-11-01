import { describe, expect, it } from 'vitest'
import {
  parseCntColumnValue,
  parseCountCell,
  resolveChartExExclusiveEnd,
  resolveDefaultCntColumnIndex,
} from '@/Utils/dcChartColumnIndex.js'

describe('resolveDefaultCntColumnIndex', () => {
  it('uses the last column by default', () => {
    expect(resolveDefaultCntColumnIndex(14, {})).toBe(13)
  })

  it('keeps an explicit cntColumnIndex', () => {
    expect(resolveDefaultCntColumnIndex(14, { common: { cntColumnIndex: 9 } })).toBe(9)
    expect(resolveDefaultCntColumnIndex(14, { common: { cntColumnIndex: '10' } })).toBe(10)
  })

  it('falls back when cntColumnIndex is empty', () => {
    expect(resolveDefaultCntColumnIndex(10, { common: { cntColumnIndex: '' } })).toBe(9)
  })
})

describe('parseCntColumnValue', () => {
  it('returns null when unset or blank', () => {
    expect(parseCntColumnValue({})).toBeNull()
    expect(parseCntColumnValue({ common: { cntColumnValue: '' } })).toBeNull()
    expect(parseCntColumnValue({ common: { cntColumnValue: 'x' } })).toBeNull()
  })

  it('parses an integer', () => {
    expect(parseCntColumnValue({ common: { cntColumnValue: 1 } })).toBe(1)
    expect(parseCntColumnValue({ common: { cntColumnValue: '5' } })).toBe(5)
    expect(parseCntColumnValue({ common: { cntColumnValue: 0 } })).toBe(0)
  })
})

describe('resolveChartExExclusiveEnd', () => {
  it('stops chartEx before the count column', () => {
    expect(resolveChartExExclusiveEnd(14, {})).toBe(13)
    expect(resolveChartExExclusiveEnd(14, { common: { cntColumnIndex: 9 } })).toBe(9)
  })

  it('includes the last column as chartEx when cntColumnValue is set', () => {
    const end = resolveChartExExclusiveEnd(14, { common: { cntColumnValue: 1 } })
    expect(end).toBe(14)
  })
})

describe('parseCountCell', () => {
  it('treats empty and invalid cells as 1', () => {
    expect(parseCountCell('')).toBe(1)
    expect(parseCountCell(null)).toBe(1)
    expect(parseCountCell('abc')).toBe(1)
    expect(parseCountCell('88')).toBe(88)
  })
})
