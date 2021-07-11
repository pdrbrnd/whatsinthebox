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

type IMDBSuggestion = { id: string; q: string }
export async function getImdbId(movieTitle: string): Promise<string | null> {
  const url =
    IMDB_SUGGESTIONS_ENDPOINT +
    `/${movieTitle.charAt(0).toLowerCase()}/` +
    movieTitle
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(' ', '_') +
    '.json'
  const res = await fetch(url)
  const data: { d?: IMDBSuggestion[] } = await res.json()

  if (!data.d) return null

  const possibleMovies = data.d.filter(
    (item) => item.id.startsWith('tt') && item.q === 'feature'
  )

  let result: string | null = null
  await asyncForEach(possibleMovies, async (m) => {
    const res = await fetch(`https://www.imdb.com/title/${m.id}/releaseinfo`)
    const data = await res.text()
    const html = parse(data)

    const portugueseTitle = Array.from(html.querySelectorAll('.aka-item')).find(
      (node) => node.querySelector('.aka-item__name').innerText === 'Portugal'
    )

    if (
      !result && // first exact match is best
      portugueseTitle &&
      portugueseTitle
        .querySelector('.aka-item__title')
        .rawText.toLowerCase() ===
        movieTitle.toLowerCase().replace(' (v.o.)', '').replace(' (v.p)', '')
    ) {
      result = m.id
    }
  })

  return result
}
