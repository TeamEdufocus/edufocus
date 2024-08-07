import { AuthForm, InputBox } from '../../components/AuthForm';
import { useRef, useState, useEffect } from 'react';
import styles from './PasswordResetPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { usePasswordReset } from '../../hooks/api/usePasswordReset';

export default function PasswordResetPage() {
  const navigate = useNavigate();
  const [time, setTime] = useState(5);
  const [emailSent, setEmailSent] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const emailRef = useRef('');

  const { sendEmail } = usePasswordReset();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotFound(false);
    await sendEmail(emailRef.current.value)
      .then(() => {
        setEmailSent(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.message === 'Request failed with status code 404') {
          setNotFound(true);
        }
        return;
      });
  };

  useEffect(() => {
    if (!emailSent) {
      return;
    }
    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [emailSent]);

  useEffect(() => {
    if (time === 0) {
      navigate('../resetAuth');
    }
  }, [navigate, time]);

  return emailSent ? (
    <section className={styles.loginGroup}>
      <h1 className={styles.title}>인증번호 받기</h1>
      <p className={styles.text}>
        비밀번호 초기화 인증번호를 이메일로 보냈습니다.
        <br />
        메일함을 확인해주세요.
        <br />
        <span className={styles.seconds}>{time}초</span> 후에 자동으로 인증번호 입력 페이지로 이동합니다.
      </p>
      <Link
        to={'../resetAuth'}
        className={styles.linkButton}
      >
        인증번호 입력하러 가기
      </Link>
    </section>
  ) : (
    <div className={styles.wrapper}>
      <AuthForm
        onSubmit={handleSubmit}
        title="비밀번호 재설정"
        buttonText="인증번호 받기"
      >
        <InputBox
          title="이메일"
          id="email"
          type="email"
          ref={emailRef}
          hasError={notFound}
        >
          {notFound && <div>존재하지 않는 이메일입니다</div>}
        </InputBox>
      </AuthForm>
    </div>
  );
}
