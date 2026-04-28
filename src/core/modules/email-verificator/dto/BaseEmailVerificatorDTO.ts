export interface BaseEmailVerificatorDTO {
  id: string
  userId: string
  codeHash: string
  expiresAt: Date
}