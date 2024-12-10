import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import { BiLogInCircle } from "react-icons/bi"
import { Button, TextField, CircularProgress, Typography } from '@mui/material'

const ResetPasswordPage = () => {
    const [formData, setFormData] = useState({
        email: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const { email } = formData
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))
            toast.success("Сброс пароля был выслан вам на почту.", { autoClose: 2000 })
            navigate("/")
        } catch (error) {
            toast.error("Ошибка. Попробуйте снова.", { autoClose: 2000 })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container auth__container">
            <Typography variant="h4" align="center" gutterBottom>
                Сброс пароля <BiLogInCircle />
            </Typography>

            {isLoading && <CircularProgress />}

            <form className="auth__form" onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    value={email}
                    required
                />

                <Button
                    className="btn btn-primary"
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isLoading}
                >
                    Reset Password
                </Button>
            </form>
        </div>
    )
}

export default ResetPasswordPage
