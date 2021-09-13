import type { NextApiRequest, NextApiResponse } from 'next'

export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export function codeMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const codeIsCorrect =
    req.headers.authorization === process.env.API_CODE ||
    req.body?.payload?.code !== process.env.API_CODE

  if (req.method !== 'POST' || !codeIsCorrect) {
    res.status(401).json({ message: 'Not authorized' })
  } else {
    next()
  }
}
