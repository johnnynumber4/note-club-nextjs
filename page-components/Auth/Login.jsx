import { Button } from '@/components/Button';
import { Spacer, Wrapper } from '@/components/Layout';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Auth.module.css';
import toast from 'react-hot-toast';

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace('/feed');
      toast.success('You have been logged in.');
    }
  }, [session, router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn('discord');
    } catch (error) {
      toast.error('Failed to log in with Discord.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      toast.success('You have been logged out.');
    } catch (error) {
      toast.error('Failed to log out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper className={styles.root}>
      <div className={styles.main}>
        <h1 className={styles.title}>Log In to Rock</h1>
        {session ? (
          <>
            <p>Welcome, {session.user.name}!</p>
            <Button
              onClick={handleLogout}
              className={styles.submit}
              type="success"
              size="large"
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Log out'}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleLogin}
            className={styles.submit}
            type="success"
            size="large"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in with Discord'}
          </Button>
        )}
        <Spacer size={0.25} axis="vertical" />
      </div>
    </Wrapper>
  );
};

export default Login;
