import React, { useContext, useEffect } from 'react'
import { Alert, Button, Container, Modal } from 'react-bootstrap'
import { AppChoiceActions, ChoiceContext } from '../../contexts/DialogContext'
import { BackendError } from '../../types'
import { AxiosResponse } from 'axios'
import { DeleteUser } from '../../services/UserServices'
import { useMutation } from 'react-query'
import { queryClient } from '../..'
import { IUser } from '../../types/user.type'

function DeleteUserModel({ user }: { user: IUser }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (DeleteUser,
            {
                onSuccess: () => {
                    queryClient.invalidateQueries('users')

                }
            }
        )

    useEffect(() => {
        if (isSuccess)
            setTimeout(() => {
                setChoice({ type: AppChoiceActions.close })
            }, 1000)
    }, [setChoice, isSuccess])
    return (
        <Modal
            show={choice === AppChoiceActions.delete_user ? true : false}
            onHide={() => setChoice({ type: AppChoiceActions.close })}
            centered
        >
            {
                isError ? (
                    <Alert variant="danger">
                        {error?.response.data.message}
                    </Alert>

                ) : null
            }
            {
                isSuccess ? (
                    <Alert color="success">
                        logged in
                    </Alert>
                ) : null
            }
            <Container className='p-2'>
                <p className="tetx-center d-block fs-4 fw-bold text-uppercase p-2">Confirm To Delete "{user.username}"</p>
                <Container className="d-flex w-100 jusify-content-center align-items-center gap-2">

                    <Button variant="outline-danger" className="w-100"
                        onClick={() => {
                            mutate(user._id)
                            if (!error)
                                setChoice({ type: AppChoiceActions.close })
                        }
                        }
                    >Yes</Button>
                    <Button variant="primary" className="w-100"
                        onClick={() => setChoice({ type: AppChoiceActions.close })}
                    >NO</Button>
                </Container>
            </Container>
        </Modal>
    )
}

export default DeleteUserModel