import { SystemVariableData } from '@/@types/System'
import {
    apiGetSystemSettings,
    apiAddSystemVariable,
    apiUpdateSystemVariable,
} from '@/services/SettingsService'

type Status = 'success' | 'failed'

function useSettings() {
    const getSystemSettings = async () => {
        try {
            const resp = await apiGetSystemSettings()
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const addSystemVariable = async (values: SystemVariableData) => {
        try {
            const resp = await apiAddSystemVariable(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const updateSystemVariable = async (values: SystemVariableData) => {
        try {
            const resp = await apiUpdateSystemVariable(values)
            if (resp.data) {
                return {
                    status: 'success',
                    message: '',
                    data: resp.data,
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    return {
        getSystemSettings,
        addSystemVariable,
        updateSystemVariable,
    }
}

export default useSettings
