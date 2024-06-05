export type SignInCredential = {
    userId: string
    password: string
}

export type SignOutCredential = {
    userID: string
}

export type SignInResponse = {
    jwtToken: string
    user: {
        userName: string
        authority: string[]
        avatar: string
        id: string
        epf: string
        userID: string
    }
    _userDetails: any
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

type Response = {
    data: string
}
