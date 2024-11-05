import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function performanceMiddleware(request: NextRequest) {
  const startTime = performance.now()

  const response = NextResponse.next()

  response.headers.set('Server-Timing', `total;dur=${performance.now() - startTime}`)

  return response
} 