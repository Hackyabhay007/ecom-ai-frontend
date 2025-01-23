import React, { createContext, useContext, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  retrieveCustomer,
  updateCustomer,
  signup,
  login,
  signout
} from "../../redux/slices/authSlice"

const UserContext = createContext(undefined)

export const UserProvider = ({ children }) => {
  const dispatch = useDispatch()
  const { currentCustomer, token, isLoading } = useSelector(
    state => state.customer
  )

  const getUserProfile = useCallback(async () => {
    await dispatch(retrieveCustomer())
  }, [dispatch])

  const updateProfile = useCallback(
    async userData => {
      await dispatch(updateCustomer(userData))
    },
    [dispatch]
  )

  const registerUser = useCallback(
    async (formData, secretKey) => {
      await dispatch(signup({ formData, secretKey }))
    },
    [dispatch]
  )

  const loginUser = useCallback(
    async (formData, secretKey) => {
      await dispatch(login({ formData, secretKey }))
    },
    [dispatch]
  )

  const logoutUser = useCallback(
    async countryCode => {
      await dispatch(signout(countryCode))
    },
    [dispatch]
  )

  const contextValue = {
    user: currentCustomer,
    token,
    isAuthenticated: !!token,
    isLoading,
    getUserProfile,
    updateProfile,
    registerUser,
    loginUser,
    logoutUser
  }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
