/**
 * DcChart CSV 列レイアウト。
 * chartEx は列 8 からカウント列の直前まで。
 * カウントは最終列。common.cntColumnIndex で上書きできる。
 * common.cntColumnValue があるときはカウント列なし（最終列も chartEx）。
 */

export const D_EX0 = 8
export const FALLBACK_CNT_COLUMN_INDEX = 8
export const DC_CNT_COLUMN_VALUE_KEY = 'dcCntColumnValue'

export function lastColumnIndex(columnCount) {
  const n = Number(columnCount)
  if (!Number.isFinite(n) || n <= 0) {
    return FALLBACK_CNT_COLUMN_INDEX
  }
  return Math.max(0, Math.trunc(n) - 1)
}

/**
 * カウントセル。空 / 欠損 / 非数は 1。
 */
export function parseCountCell(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return 1
  }
  const n = parseInt(String(raw), 10)
  return Number.isFinite(n) ? n : 1
}

/**
 * common.cntColumnIndex。未指定・空・非数は最終列。
 */
export function resolveDefaultCntColumnIndex(headerLength, opt) {
  const last = lastColumnIndex(headerLength)
  const raw = opt?.common?.cntColumnIndex
  if (raw === undefined || raw === null || raw === '') {
    return last
  }
  const n = parseInt(String(raw), 10)
  return Number.isFinite(n) ? n : last
}

/**
 * common.cntColumnValue。有限な整数なら、CSV にカウント列は不要で全行この値。
 * 未指定・空・非数は null（カウント列を読む）。
 */
export function parseCntColumnValue(opt) {
  const raw = opt?.common?.cntColumnValue
  if (raw === undefined || raw === null || raw === '') {
    return null
  }
  const n = parseInt(String(raw), 10)
  return Number.isFinite(n) ? n : null
}

/**
 * chartEx の終端（排他）。
 * cntColumnValue があるときは列数（最終列も chartEx）。無いときはカウント列 index。
 */
export function resolveChartExExclusiveEnd(headerLength, opt) {
  if (parseCntColumnValue(opt) != null) {
    const n = Number(headerLength)
    return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 0
  }
  return resolveDefaultCntColumnIndex(headerLength, opt)
}
