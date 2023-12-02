/** Example purpose only */
import useTest from '@/utils/hooks/useTest'
import Button from '@/components/ui/Button'

const { test } = useTest()

const Dashboard = () => {
    //  const result = await signIn({ "3021ITFI", "pass#word1" });
    let UserId: '3021ITFI'
    let password: 'pass#word1'
    const onSignIn = async () => {
        console.log('Val')

        const result = await test({ UserId, password })
    }

    return (
        <div>
            Dashboard
            <Button onClick={onSignIn}>Load</Button>
        </div>
    )
}

export default Dashboard
