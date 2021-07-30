import { useCallback, useEffect, useState } from 'react'

export enum UserType {
  FIRST_TIME_USER = 'FIRST_TIME_USER',
  RETURNING_USER = 'RETURNING_USER',
  FREQUENT_USER = 'FREQUENT_USER',
}

type ReturningUserData = {
  lastVisit: Date
  counter: number
}

// consider a frequent user every X visits
const FREQUENT_VISIT_AMOUNT = 3

/**
 * First time visit and nothing in storage:
 * we save the returning data in storage and return UserType.FIRST_TIME_USER
 *
 * Returning user with counter < FREQUENT_VISIT_AMOUNT:
 * we save the returning data, increase the counter and return UserType.RETURNING_USER
 *
 * If returning user with counter >= FREQUENT_VISIT_AMOUNT:
 * we save the returning data, reset the counter and return UserType.FREQUENT_USER
 *
 **/

const RETURNING_USER_KEY = '__witb_returning_user__'
export const useReturningUser = () => {
  const [userType, setUserType] = useState<null | UserType>(null)

  const getFromStorage = useCallback(() => {
    const returningUserData = localStorage.getItem(RETURNING_USER_KEY)

    return returningUserData
      ? (JSON.parse(returningUserData) as ReturningUserData)
      : null
  }, [])

  const saveInStorage = useCallback((counter: number) => {
    localStorage.setItem(
      RETURNING_USER_KEY,
      JSON.stringify({ lastVisit: new Date(), counter })
    )
  }, [])

  useEffect(
    function checkStorage() {
      const returningUserData = getFromStorage()

      if (returningUserData) {
        const { counter } = returningUserData

        if (counter < FREQUENT_VISIT_AMOUNT) {
          setUserType(UserType.RETURNING_USER)
          saveInStorage(counter + 1)
        } else {
          setUserType(UserType.FREQUENT_USER)
          saveInStorage(1)
        }
      } else {
        setUserType(UserType.FIRST_TIME_USER)
        saveInStorage(1)
      }
    },
    [getFromStorage, saveInStorage]
  )

  return userType
}
