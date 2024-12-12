import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import { BiLogInCircle } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Button, TextField, CircularProgress, Typography } from '@mui/material'
import { resetPassword, reset } from "../features/auth/authSlice"

const ResetPasswordPage = () => {
    const [formData, setFormData] = useState({
        email: "",
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const { email } = formData

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const userData = { email }
        dispatch(resetPassword(userData))
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        if (isSuccess) {
            navigate("/login")
            toast.success("Сброс пароля был выслан вам на почту")
            dispatch(reset()); 
        }
    }, [isError, isSuccess, message, navigate])

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
