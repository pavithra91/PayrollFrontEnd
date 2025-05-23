import { apiSignIn, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import bcrypt from 'bcryptjs'
type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const encryptItem = (item: any) => {
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(item, salt)

        return hashedPassword
    }

    const signIn = async (
        values: SignInCredential
    ): Promise<
        | {
              status: Status
              message: string
          }
        | undefined
    > => {
        try {
            const resp = await apiSignIn(values)
            if (resp.data) {
                const { jwtToken } = resp.data

                dispatch(signInSuccess(jwtToken))
                // if (resp.data.user) {

                dispatch(
                    setUser(
                        resp.data.user || {
                            avatar: '',
                            userName: resp.data._userDetails.empName,
                            epf: resp.data._userDetails.epf,
                            userID: resp.data._userDetails.userID,
                            authority: [resp.data._userDetails.role],
                            id: resp.data._userDetails.id,
                            costCenter: resp.data._userDetails.costCenter,
                            pwd: encryptItem(resp.data._userDetails.role),
                        }
                    )
                )
                //    }
                const redirectUrl = query.get(REDIRECT_URL_KEY)

                if (resp.data._userDetails.role == 'Admin' || resp.data._userDetails.role == 'FIAdmin') {
                    navigate(
                        redirectUrl
                            ? redirectUrl
                            : appConfig.authenticatedEntryPath
                    )
                } else {
                    navigate(
                        redirectUrl
                            ? redirectUrl
                            : appConfig.authenticatedEntryPathUser
                    )
                }

                return {
                    status: 'success',
                    message: '',
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUp = async (values: SignUpCredential) => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { jwtToken } = resp.data
                dispatch(signInSuccess(jwtToken))
                if (resp.data.user) {
                    dispatch(
                        setUser(
                            resp.data.user || {
                                avatar: '',
                                userName: 'Anonymous',
                                authority: ['USER'],
                                id: '',
                                userID: '',
                                epf: '',
                                costCenter: '',
                            }
                        )
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                avatar: '',
                userName: '',
                epf: '',
                userID: '',
                id: '',
                costCenter: '',
                authority: [],
            })
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth
