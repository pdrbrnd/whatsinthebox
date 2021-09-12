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
    .replace(/[.,/#!$%^*;:{}=\-_`~()]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const getEndpointForTitle = (title: string) => {
  const titleWithNoDotsNorDashes = title.replace(/\.|\//g, '')
  return (
    `/${titleWithNoDotsNorDashes.charAt(0).toLowerCase()}/` +
    encodeURIComponent(
      titleWithNoDotsNorDashes.normalize('NFD').replace(/\p{Diacritic}/gu, '')
    ) +
    '.json'
  )
}

// "l" is the movie title
type IMDBSuggestion = { id: string; q: string; l: string }
export async function getImdbId(
  originalMovieTitle: string
): Promise<string | null> {
  const movieTitle = originalMovieTitle
    .toLowerCase()
    .replace(' (v.o.)', '')
    .replace(' (v.p.)', '')

  const url = IMDB_SUGGESTIONS_ENDPOINT + getEndpointForTitle(movieTitle)
  const res = await fetch(url)
  const data: { d?: IMDBSuggestion[] } = await res.json()

  if (!data.d) return null

  const title = removeExtraStuff(movieTitle.toLowerCase())

  const possibleMovies = data.d.filter(
    (item) =>
      item.id.startsWith('tt') &&
      ['feature', 'tv movie', 'video'].includes(item.q?.toLowerCase())
  )

  // if only one match, we assume it's correct
  if (possibleMovies.length === 1) return possibleMovies[0].id

  let result: string | null = null
  await asyncForEach(possibleMovies, async (m) => {
    if (result) return // we already have a result

    const res = await fetch(`https://www.imdb.com/title/${m.id}/releaseinfo`)
    const data = await res.text()
    const html = parse(data)

    const ptMatches = Array.from(html.querySelectorAll('.aka-item')).filter(
      (node) => {
        return node
          .querySelector('.aka-item__name')
          ?.text.trim()
          .toLowerCase()
          .includes('portugal')
      }
    )
    const ptTitles = ptMatches.map((match) => {
      return match.querySelector('.aka-item__title').text.toLowerCase()
    })

    const originalTitle = Array.from(html.querySelectorAll('.aka-item'))
      .find(
        (node) =>
          node.querySelector('.aka-item__name')?.text.trim().toLowerCase() ===
          '(original title)'
      )
      ?.querySelector('.aka-item__title')
      .text.toLowerCase()

    const ptMatch = compareTitles(title, [
      ...ptTitles,
      // replacing " & " with " e "
      ...ptTitles.map((title) => title.replace(/\s&\s/g, ' e ')),
      // without the initial "O " or "A "
      ...ptTitles.map((title) => title.replace(/^o\s|^a\s/gi, '')),
    ])
    const originalMatch = compareTitles(title, [
      originalTitle,
      // replacing " & " with " and "
      originalTitle?.replace(/\s&\s/g, ' and '),
    ])
    const fallbackMatch = compareTitles(title, [m.l])

    if (ptMatch || originalMatch || fallbackMatch) {
      result = m.id
    }
  })

  return result
}

const compareTitles = (
  target: string,
  titles: (string | undefined)[]
): boolean => {
  return titles.some((title) => {
    return (
      removeExtraStuff((title || '').toLowerCase()) ===
      removeExtraStuff(target.toLowerCase())
    )
  })
}
