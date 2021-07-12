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

const getEndpointForTitle = (title: string) => {
  return (
    `/${title.charAt(0).toLowerCase()}/` +
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(' (v.o.)', '')
      .replace(' (v.p.)', '')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[.,/#!$%^&*;:{}=-_`~()]/g, '')
      .replace(/s{2,}/g, ' ')
      .replaceAll(' ', '_')
      .slice(0, 20) +
    '.json'
  )
}

type IMDBSuggestion = { id: string; q: string; l: string }
export async function getImdbId(movieTitle: string): Promise<string | null> {
  const url = IMDB_SUGGESTIONS_ENDPOINT + getEndpointForTitle(movieTitle)
  const res = await fetch(url)
  const data: { d?: IMDBSuggestion[] } = await res.json()

  if (!data.d) return null

  const title = movieTitle
    .toLowerCase()
    .replace(' (v.o.)', '')
    .replace(' (v.p.)', '')

  const possibleMovies = data.d.filter(
    (item) => item.id.startsWith('tt') && item.q === 'feature'
  )

  let result: string | null = null
  await asyncForEach(possibleMovies, async (m) => {
    const res = await fetch(`https://www.imdb.com/title/${m.id}/releaseinfo`)
    const data = await res.text()
    const html = parse(data)

    const ptTitle = Array.from(html.querySelectorAll('.aka-item')).find(
      (node) => node.querySelector('.aka-item__name')?.rawText === 'Portugal'
    )

    if (!ptTitle && m.l.toLowerCase() === title) result = m.id

    if (
      !result && // first exact match is best
      ptTitle &&
      ptTitle.querySelector('.aka-item__title').rawText.toLowerCase() === title
    ) {
      result = m.id
    }
  })

  return result
}
