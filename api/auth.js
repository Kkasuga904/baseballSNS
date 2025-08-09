// Vercel Edge Function for Basic Authentication
export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  // 本番環境では認証をスキップ
  if (process.env.VERCEL_ENV === 'production') {
    return new Response('OK', { status: 200 })
  }

  const authorization = request.headers.get('authorization')
  
  if (!authorization) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Staging Environment"',
      },
    })
  }

  const [scheme, encoded] = authorization.split(' ')
  
  if (scheme !== 'Basic') {
    return new Response('Invalid authentication', { status: 401 })
  }

  const decoded = atob(encoded)
  const [username, password] = decoded.split(':')
  
  const validUsername = process.env.BASIC_AUTH_USER || 'admin'
  const validPassword = process.env.BASIC_AUTH_PASSWORD || 'staging123'
  
  if (username !== validUsername || password !== validPassword) {
    return new Response('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Staging Environment"',
      },
    })
  }
  
  return new Response('OK', { status: 200 })
}