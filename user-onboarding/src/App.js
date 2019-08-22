import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Yup from 'yup';

//components
import { Header, List } from 'semantic-ui-react';
import { withFormik, Form, Field, ErrorMessage } from 'formik';

//Styling
import './App.css';
import styled from 'styled-components';

const StyledFormContainer = styled.div`
    width: 600px;
    background-color: pink;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 50px;
`;

const StyledForm = styled(Form)`
    display: flex
    flex-direction: column;
`;

const StyledFormField = styled(Field)`
    border-radius: 5px;
    height: 2rem;
    font-size: 1.4rem;
    border: ${props => (props.error ? '1px solid red' : 'none')};
    margin-top: 1rem;
    padding: 0.5rem;
`;

const StyledButton = styled(StyledFormField)`
    background-color: ${props => (props.disabled ? 'lightgrey' : 'blue')};
    max-width: 30%;
    padding: 0;
    color: white;

    :hover {
        color: blue;
        background-color: white;
    }
`;

const App = ({ values, errors, touched, status, isSubmitting }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (status) {
            setUsers([...users, status]);
        }
    }, [status]);

    return (
        <div className="App">
            <Header as="h1" content="Sign Up For My Thing!" />
            <StyledFormContainer>
                <StyledForm>
                    <StyledFormField
                        name="name"
                        type="text"
                        placeholder="First Name"
                        error={errors.name && touched.name}
                    />
                    {errors.name && touched.name && <p>{errors.name}</p>}
                    <StyledFormField
                        name="email"
                        type="email"
                        placeholder="Email"
                        error={errors.email && touched.email}
                    />
                    {errors.email && touched.email && <p>{errors.email}</p>}
                    <StyledFormField
                        name="password"
                        type="password"
                        placeholder="Password"
                        error={errors.password && touched.email}
                    />
                    {errors.password && touched.password && (
                        <p>{errors.password}</p>
                    )}
                    <label htmlFor="password">Must be 8 characters long</label>
                    <StyledFormField
                        name="phone"
                        type="tel"
                        placeholder="Phone Number"
                    />
                    <label htmlFor="termsOfService">
                        <StyledFormField
                            name="termsOfService"
                            type="checkbox"
                            checked={values.termsOfService}
                        />
                        Terms Of Service
                    </label>
                    <StyledButton
                        as="button"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        Submit
                    </StyledButton>
                </StyledForm>
            </StyledFormContainer>
            <StyledFormContainer>
                {users.map(user => {
                    return (
                        <List>
                            <List.Item>{user.name}</List.Item>
                            <List.Item>{user.email}</List.Item>
                        </List>
                    );
                })}
            </StyledFormContainer>
        </div>
    );
};

const FormikApp = withFormik({
    mapPropsToValues({ name, email, password, phone, termsOfService }) {
        return {
            name: name || '',
            email: email || '',
            password: password || '',
            phone: phone || '',
            termsOfService: termsOfService || false,
        };
    },

    validationSchema: Yup.object().shape({
        name: Yup.string().required('Need a name'),
        email: Yup.string()
            .email()
            .required(),
        password: Yup.string()
            .min(8)
            .required(),
        phone: Yup.string()
            .min(10)
            .required(),
    }),

    handleSubmit(values, { setStatus, resetForm, setErrors, setSubmitting }) {
        axios.post('https://reqres.in/api/users', values).then(response => {
            setStatus(response.data);
            resetForm();
        });
    },
})(App);

export default FormikApp;
