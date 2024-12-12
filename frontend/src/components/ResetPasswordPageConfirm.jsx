import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from "react-redux"
import { resetPasswordConfirm, reset } from '../features/auth/authSlice'
import { AiFillLock } from 'react-icons/ai'
import { Button, TextField, CircularProgress, Typography, Box } from '@mui/material'

const ResetPasswordPageConfirm = () => {
    const { uid, token } = useParams()
    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    })

    const { new_password, re_new_password } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const userData = {
            uid,
            token,
            new_password,
            re_new_password
        }
        dispatch(resetPasswordConfirm(userData))
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        if (isSuccess) {
            navigate("/")
            toast.success("Your password was reset successfully.")
            dispatch(reset()); 
        }
    }, [isError, isSuccess, message, navigate, dispatch])

    return (
        <Box className="container auth__container" sx={{ maxWidth: 400, margin: 'auto', mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Reset Password <AiFillLock />
            </Typography>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}

            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <TextField
                    label="New Password"
                    type="password"
                    name="new_password"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    value={new_password}
                    required
                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    name="re_new_password"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    value={re_new_password}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isLoading}
                    sx={{ mt: 2 }}
                >
                    Reset Password
                </Button>
            </form>
        </Box>
    )
}

export default ResetPasswordPageConfirm
