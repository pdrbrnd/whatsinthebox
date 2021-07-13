import { parse } from 'node-html-parser'

// use with /<first_char>/<movie_title_lowercase_with_underscores>.json
// e.g.: https://v2.sg.media-imdb.com/suggestion/o/o_padrinho.json
const IMDB_SUGGESTIONS_ENDPOINT = 'https://v2.sg.media-imdb.com/suggestion'

async function asyncForEach<T extends unknown[]>(
  array: T,
  callback: (item: T[0], index: number, arr: T) => Promise<void>
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const removeExtraStuff = (text: string) => {
  return text
    .replace(' (v.o.)', '')
    .replace(' (v.p.)', '')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const getEndpointForTitle = (title: string) => {
  const base = `/${title.charAt(0).toLowerCase()}/`
  let sanitizedTitle = removeExtraStuff(title.toLowerCase())
  sanitizedTitle = sanitizedTitle.substring(0, 20)
  sanitizedTitle = sanitizedTitle.normalize('NFD')
  sanitizedTitle = sanitizedTitle.replace(/\p{Diacritic}/gu, '')
  sanitizedTitle = sanitizedTitle.replaceAll(' ', '_')

  return base + sanitizedTitle + '.json'
}

type IMDBSuggestion = { id: string; q: string; l: string }
export async function getImdbId(movieTitle: string): Promise<string | null> {
  const url = IMDB_SUGGESTIONS_ENDPOINT + getEndpointForTitle(movieTitle)
  const res = await fetch(url)
  const data: { d?: IMDBSuggestion[] } = await res.json()

  if (!data.d) return null

  const title = removeExtraStuff(movieTitle.toLowerCase())

  const possibleMovies = data.d.filter(
    (item) =>
      item.id.startsWith('tt') && ['feature', 'TV movie'].includes(item.q)
  )

  let result: string | null = null
  await asyncForEach(possibleMovies, async (m) => {
    if (result) return // we already have a result

    const res = await fetch(`https://www.imdb.com/title/${m.id}/releaseinfo`)
    const data = await res.text()
    const html = parse(data)

    const ptTitle = Array.from(html.querySelectorAll('.aka-item'))
      .find(
        (node) =>
          node
            .querySelector('.aka-item__name')
            ?.rawText.trim()
            .toLowerCase() === 'portugal'
      )
      ?.querySelector('.aka-item__title')
      .rawText.toLowerCase()
    const originalTitle = Array.from(html.querySelectorAll('.aka-item'))
      .find(
        (node) =>
          node
            .querySelector('.aka-item__name')
            ?.rawText.trim()
            .toLowerCase() === '(original title)'
      )
      ?.querySelector('.aka-item__title')
      .rawText.toLowerCase()

    const ptMatch = removeExtraStuff(ptTitle || '') === title
    const originalMatch = removeExtraStuff(originalTitle || '') === title
    const fallbackMatch = removeExtraStuff(m.l.toLowerCase()) === title

    if (ptMatch || originalMatch || fallbackMatch) {
      result = m.id
    }
  })

  return result
}
