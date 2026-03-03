import { jwtDecode } from 'jwt-decode'

export type JwtParts = {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  raw: { header: string; payload: string; signature: string }
}

export function decodeJwt(token: string): JwtParts {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT: must have 3 parts separated by "."')
  }

  const [rawHeader, rawPayload, rawSignature] = parts

  const header = jwtDecode<Record<string, unknown>>(token, { header: true })
  const payload = jwtDecode<Record<string, unknown>>(token)

  return {
    header,
    payload,
    signature: rawSignature,
    raw: {
      header: rawHeader,
      payload: rawPayload,
      signature: rawSignature,
    },
  }
}

const claimDescriptions: Record<string, string> = {
  iss: 'トークンの発行者 (Issuer)',
  sub: 'トークンの主体 (Subject)',
  aud: 'トークンの受信者 (Audience)',
  exp: '有効期限 (Expiration Time) - Unix タイムスタンプ',
  iat: '発行日時 (Issued At) - Unix タイムスタンプ',
  nbf: '有効開始日時 (Not Before) - Unix タイムスタンプ',
  jti: 'JWT の一意識別子 (JWT ID)',
}

export function getClaimDescription(key: string): string {
  return claimDescriptions[key] ?? ''
}
