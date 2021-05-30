import { useState } from 'react';
import { Container, Form, Alert, Button } from 'react-bootstrap';
import { sendResetEmail } from '../../services/auth.service';
import style from '../../styles/login.module.css';
import { LoadingOverlay } from '../UI/LoadingOverlay';

export const ForgotPassword = () => {
  const [resetEmail, setResetEmail] = useState();
  const [formError, setformError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleForgotPWD = async (e) => {
    e.preventDefault();
    if (resetEmail.length > 0) {
      setLoading(true);
      await sendResetEmail(resetEmail).then((res) => {
        console.log('res', res);
        if (res != null) {
          setformError(
            `Your password reset link has sent to the ${res.email}.\nPlease follow the link to reset password.`
          );
        } else {
          setformError(
            `No user account associate with ${resetEmail}.\nPlease try again.`
          );
        }
        setLoading(false);
      });
    }
  };

  return (
    <Container className={style.form_container_flex}>
      {loading ? (
        <LoadingOverlay show={loading} />
      ) : (
        <div className={style.form_signin}>
          {formError !== null ? (
            <Alert variant={'success'}>
              <Alert.Link className="text-decoration-none">
                {formError}
              </Alert.Link>
            </Alert>
          ) : (
            <></>
          )}
          <Form onSubmit={handleForgotPWD}>
            <Form.Label className="text-muted my-3">
              Please provide your email address which associate with the account
            </Form.Label>
            <Form.Group controlId="formPassword">
              <Form.Control
                type="email"
                name="reset_email"
                placeholder="Email"
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className={'w-100 btn btn-lg btn-primary'}
            >
              Send Reset Link
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
};
