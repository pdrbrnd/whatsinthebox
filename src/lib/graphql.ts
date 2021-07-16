const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || ''
const HASURA_SECRET = process.env.HASURA_SECRET || ''

export async function fetchGraphql<T = any, V = Record<string, any>>({
  query,
  variables,
  headers = {},
  includeAdminSecret,
}: {
  query: string
  variables?: V
  headers?: Record<string, string>
  includeAdminSecret?: boolean
}) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(includeAdminSecret ? { 'x-hasura-admin-secret': HASURA_SECRET } : {}),
      ...(headers || {}),
    },
    body: JSON.stringify(variables ? { query, variables } : { query }),
  })
  const data: {
    data?: T
    errors?: { extensions: { path: string; code: string }; message: string }[]
  } = await res.json()

  if (!res.ok) throw new Error('Failed to fetch Graphql API')

  return data
}
