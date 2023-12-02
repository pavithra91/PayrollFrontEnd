import { apigetToken } from '@/services/UserService'

export type SignInCredential = {
    UserId: string
    password: string
}

function useTest() {
    const test = async (
        values: SignInCredential
    ): Promise<
        | {
              status: string
              message: string
          }
        | undefined
    > => {
        try {
            const resp = await apigetToken(values)
            if (resp.data) {
                console.log(resp.data)
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
    return {
        test,
    }
}

export default useTest
