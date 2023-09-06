// import { useTheme } from 'next-themes';
// import { useCallback } from 'react';
// import styles from './ThemeSwitcher.module.css';

// const ThemeSwitcher = () => {
//   const { theme, setTheme } = useTheme();
//   const onChange = useCallback(
//     (e) => {
//       setTheme(e.target.checked ? 'light' : 'dark');
//     },
//     [setTheme]
//   );
//   return (
//     // <select value={theme} onChange={onChange} className={styles.select}>
//     //   <option value="system">System</option>
//     //   <option value="dark">Dark</option>
//     //   <option value="light">Light</option>
//     // </select>
//     <div className={styles.toggle}>
//       <input value="system" onChange={onChange} type="checkbox" />
//       <label></label>
//     </div>
//   );
// };

// export default ThemeSwitcher;

import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import styles from './ThemeSwitcher.module.css';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const onChange = useCallback(
    (e) => {
      setTheme(e.currentTarget.value);
    },
    [setTheme]
  );
  return (
    <select value={theme} onChange={onChange} className={styles.select}>
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
};

export default ThemeSwitcher;
