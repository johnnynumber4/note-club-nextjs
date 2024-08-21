import { Avatar } from '@/components/Avatar';
import { ButtonLink } from '@/components/Button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Container from './Container';
import styles from './Nav.module.css';
import Spacer from './Spacer';
import Wrapper from './Wrapper';
import { Search } from '@/components/Search';
import { usePostPages } from '@/lib/post';
import { signOut, useSession } from 'next-auth/react';

const Nav = () => {
  const { data: user, mutate } = useCurrentUser();
  const { data: session } = useSession();
  const { data } = usePostPages();
  const posts = data ? data.flatMap((val) => val.posts) : [];

  const [visible, setVisible] = useState(false);
  const menuRef = useRef();
  const avatarRef = useRef();
  const router = useRouter();

  // Close the menu when the route changes
  useEffect(() => {
    const onRouteChangeComplete = () => setVisible(false);
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    return () =>
      router.events.off('routeChangeComplete', onRouteChangeComplete);
  }, [router.events]);

  // Close the menu when clicking outside of it
  useEffect(() => {
    const onMouseDown = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: '/' });
      toast.success('You have been signed out');
      mutate({ user: null });
    } catch (e) {
      toast.error('Failed to sign out');
    }
  }, [mutate]);

  return (
    <nav className={styles.nav}>
      <Wrapper className={styles.wrapper}>
        <Container
          className={styles.content}
          alignItems="center"
          justifyContent="space-between"
        >
          <Link href="/" legacyBehavior>
            <a className={styles.logo}>Note Club</a>
          </Link>
          <Search posts={posts} />
          <Container>
            {session ? (
              <div className={styles.user}>
                <button
                  className={styles.trigger}
                  ref={avatarRef}
                  onClick={() => setVisible(!visible)}
                >
                  <Avatar
                    size={32}
                    username={session?.user?.name}
                    url={session?.user?.image}
                  />
                </button>
                {visible && (
                  <div
                    ref={menuRef}
                    role="menu"
                    aria-hidden={!visible}
                    className={styles.popover}
                  >
                    <div className={styles.menu}>
                      <Link
                        passHref
                        href={`/user/${session?.user?.name}`}
                        legacyBehavior
                      >
                        <a className={styles.item}>Profile</a>
                      </Link>
                      <Link passHref href="/settings" legacyBehavior>
                        <a className={styles.item}>Settings</a>
                      </Link>
                      <div className={styles.item} style={{ cursor: 'auto' }}>
                        <Container alignItems="center">
                          <span>Theme</span>
                          <Spacer size={0.5} axis="horizontal" />
                          <ThemeSwitcher />
                        </Container>
                      </div>
                      <button onClick={handleSignOut} className={styles.item}>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link passHref href="/login">
                  <ButtonLink
                    size="small"
                    type="success"
                    variant="ghost"
                    color="link"
                  >
                    Log in
                  </ButtonLink>
                </Link>
                <Spacer axis="horizontal" size={0.25} />
              </>
            )}
          </Container>
        </Container>
      </Wrapper>
    </nav>
  );
};

export default Nav;
