import { LoginForm } from '@/features/auth'
import { AuthSplitScreen } from '@/widgets/auth-layout'

const LoginPage = () => {
  return (
    <AuthSplitScreen>
        <LoginForm />
    </AuthSplitScreen>
  )
}

export default LoginPage